import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

export interface IUser {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  dataCriacao?: Date;
}

class User extends Model implements IUser {
  public id!: number;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public readonly dataCriacao!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: false
  }
);

User.beforeCreate(async (user: User) => {
  user.senha = await bcrypt.hash(user.senha, 10);
});

User.beforeUpdate(async (user: User) => {
  if (user.changed('senha')) {
    user.senha = await bcrypt.hash(user.senha, 10);
  }
});

export default User;
