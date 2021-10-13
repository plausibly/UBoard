"use strict";
import Sequelize, { Model, UUIDV4, DataTypes } from "sequelize";


interface UserAttributes {
  /* Login Specific */
  id: string;
  userName: string;
  password: string; // hash
  email: string;

  /* Logs */
  lastLogin: Date;
  karma: Number;
};


module.exports = (sequelize: Sequelize.Sequelize) => {

  class User extends Model<UserAttributes> implements UserAttributes {
    id!: string; // uuidv4
    userName!: string;
    password!: string;
    email!: string;

    lastLogin!: Date;
    karma!: Number; // Should not be revealed to public

    static associate(model: any){
      User.hasMany(model.Post,  {foreignKey: { allowNull: false }}); 
      User.hasMany(model.Comment, {  foreignKey: { allowNull: false }});
      /* Userid is stored inside of respective Post, and Comment */
    }

  };

   User.init({
    id:
    {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    
    userName:
    {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true
    },    
    
    password:
    {
      type: DataTypes.STRING,
      allowNull: false
    },   
    email:
    {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true, /* In the controller, lets force email to lowercase */
      validate : {
         isEmail: true, /* Check for valid email format */
         is: [".*@(mail\.||alum\.||^$)utoronto.ca"],  /* Check for utoronto domain */
      }
    },
    lastLogin:
    {
      type: DataTypes.DATE,
    },
    karma: 
    {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, 
  {
    modelName: 'User',
    sequelize
  });

 
  return User;
};
