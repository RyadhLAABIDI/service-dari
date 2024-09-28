import mongoose from "mongoose";
import bcrypt from "bcrypt";


const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
          phoneNumber: {
            type: String,
            required: true,
            unique: true,
          },
          password: {
            type: String,
            required: true,
          },
          avatar: {
            type: String,
            default: "defaultAvatar.png",
          },
          role: {
            type: String,
            enum: ["USER", "ADMIN","PROVIDER"],
            default: "USER", 
          },
          banned: {
            type: Boolean,
            default: false,
          },
          etatDelete: {
            type: Boolean,
            default: false,
          },
        },
        {
          timestamps: true,
        }
    );


    userSchema.pre("save", async function () {
        try {
          var user = this;
          const salt = await bcrypt.genSalt(10);
          const hashpass = await bcrypt.hash(user.password, salt);
          user.password = hashpass;
        } catch (error) {
          throw error;
        }
      });
      userSchema.pre("findOneAndUpdate", async function () {
        try {
          if (this._update.password) {
            const salt = await bcrypt.genSalt(10);
            const hashpass = await bcrypt.hash(this._update.password, salt);
            this._update.password = hashpass;
          }
        } catch (error) {
          throw error;
        }
      });
      
const UserModel = model("User", userSchema);
export default UserModel;