import { DataTypes } from 'sequelize';

export default function model(sequelize: any) {
    const attributes = {
        accountId: { type: DataTypes.INTEGER, allowNull: false },
        token: { type: DataTypes.STRING, allowNull: false },
        expires: { type: DataTypes.DATE, allowNull: false },
        createdByIp: { type: DataTypes.STRING, allowNull: false },
        revoked: { type: DataTypes.DATE },
        revokedByIp: { type: DataTypes.STRING },
        replacedByToken: { type: DataTypes.STRING },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE }
    };

    const options = {
        timestamps: false,
        getterMethods: {
            isActive() {
                return !this.revoked && this.expires > new Date();
            }
        }
    };

    return sequelize.define('refreshToken', attributes, options);
}