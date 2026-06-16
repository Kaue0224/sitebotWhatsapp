import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface IBot {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  usuarioId: number;
  ativo: boolean;
  dataCriacao?: Date;
}

class Bot extends Model implements IBot {
  public id!: number;
  public nome!: string;
  public descricao!: string;
  public preco!: number;
  public usuarioId!: number;
  public ativo!: boolean;
  public readonly dataCriacao!: Date;
}

Bot.init(
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
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'bots',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: false
  }
);

Bot.belongsTo(User, { foreignKey: 'usuarioId' });
User.hasMany(Bot, { foreignKey: 'usuarioId' });

export default Bot;
