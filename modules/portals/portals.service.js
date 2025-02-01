import { JobPortal } from '../../models/index.js';
import sequelize from '../../config/db.js';
import codes from '../../utils/httpStatusCode.js';
import { responseMessage } from '../../utils/message.js';
import { deleteFromS3, uploadToS3 } from '../../utils/s3upload.js';

export const createJobPortal = async (portalData) => {
  const trx = await sequelize.transaction();

  try {
    const existingPortal = await JobPortal.findOne({
      where: { name: portalData.name },
      trx
    });

    console.log('existingPortal', existingPortal);
    
    if (existingPortal) {
      throw { 
        status: codes.Conflict, 
        message: responseMessage.PORTAL_EXISTS 
      };
    }

    const portal = await JobPortal.create({
      name: portalData.name,
      description: portalData.description,
      status: portalData.status
    }, { trx });

    // logo upload
    if (portalData.logoData) {
      const { originalname, size } = portalData.logoData;
      try {
        const { logoUrl } = await uploadToS3(portalData.logoData, portal.id);
        await portal.update({
          logo_file_name: originalname,
          logo_url: logoUrl,
          logo_file_size: size
        }, { trx });

      } catch (uploadError) {
        await trx.rollback();
        throw uploadError;
      }
    }

    await trx.commit();
    const portalDataValues = portal.dataValues;
    return portalDataValues;

  } catch (error) {
    console.log('error', error);
    
    await trx.rollback();
    throw error;
  }
};

export const getJobPortal = async () => {  
    try {
      const portals = await JobPortal.findAll({
        where: { status: 'active' },
        raw: true,
      });

      return portals;
  
    } catch (error) {
      throw error;
    }
  };

export const deleteJobPortal = async (id) => { 
    try {
        const isexist = await JobPortal.findOne({
            where: { id , status: 'active'},
            attributes: ['id', 'name', 'description'],
            raw: true
        })
        
        if(!isexist) {
            throw { 
                status: codes.BadRequest, 
                message: responseMessage.INVALID_PORTAL_ID 
            };
        }
        const [updatedRows] = await JobPortal.update(
            { status: 'inactive' },
            {
                where: { id },
                returning: true,
            }
        );
        
        if (updatedRows === 0) {
            throw {
                status: codes.InternalServerError,
                message: responseMessage.INTERNAL_SERVER_ERROR
            };
        }
        
        return isexist;
    } catch (error) {
        throw error;
    }
};

export const updateJobPortal = async (id, portalData) => { 
    const trx = await sequelize.transaction(); 
    try {
        const isexist = await JobPortal.findOne({
            where: { id, status: 'active' },
            attributes: ['id', 'name', 'description', 'logo_url', 'logo_file_name'],
            raw: true,
            transaction: trx 
        });
        
        if (!isexist) {
            throw { 
                status: codes.BadRequest, 
                message: responseMessage.INVALID_PORTAL_ID 
            };
        }

        if (portalData.logoData) {
            const { originalname, size } = portalData.logoData;
            try {
                const { logoUrl } = await uploadToS3(portalData.logoData, id);  
                await JobPortal.update(
                    { 
                        logo_file_name: originalname,
                        logo_url: logoUrl,
                        logo_file_size: size
                    },
                    {
                        where: { id },
                        transaction: trx 
                    }
                );

                if (isexist?.logo_url) {
                    await deleteFromS3(isexist.logo_url); 
                }

            } catch (uploadError) {
                await trx.rollback();
                throw uploadError; 
            }
        }

        const [updatedRows] = await JobPortal.update(
            { 
                name: portalData?.name,
                description: portalData?.description
            },
            {
                where: { id },
                returning: true,
                transaction: trx
            }
        );

        if (updatedRows === 0) {
            throw {
                status: codes.InternalServerError,
                message: responseMessage.INTERNAL_SERVER_ERROR
            };
        }

        await trx.commit();  
        return {
            id,
            name: portalData?.name,
            description: portalData?.description,
        };  
    } catch (error) {
        await trx.rollback(); 
        throw error; 
    }
};

