import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export type PlanoBot = 'basico' | 'profissional' | 'enterprise';
export type StatusPedido = 'pendente' | 'confirmado' | 'cancelado';

export interface IPedido {
  id?: number;
  usuarioId: number;
  plano: PlanoBot;
  status: StatusPedido;
  dataCriacao?: Date;
}

class Pedido extends Model implements IPedido {
  public id!: number;
  public usuarioId!: number;
  public plano!: PlanoBot;
  public status!: StatusPedido;
  public readonly dataCriacao!: Date;
}

Pedido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' }
    },
    plano: {
      type: DataTypes.ENUM('basico', 'profissional', 'enterprise'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado'),
      defaultValue: 'pendente',
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'pedidos',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: false
  }
);

Pedido.belongsTo(User, { foreignKey: 'usuarioId' });
User.hasMany(Pedido, { foreignKey: 'usuarioId' });

export default Pedido;
