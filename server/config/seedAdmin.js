import bcrypt from "bcryptjs";
import Admin from "../module/Admin.js";

export const seedAdmin = async () => {
  try {
    const adminEmail = "vedabooti@admingmail.com";
    const plainPassword = "VEDABOOTI@123#";

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const newAdmin = await Admin.create({
        name: "Veda Booti Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`[Admin Seeder] Created initial admin: ${newAdmin.email}`);
    } else {
      // Verify if current password matches VEDABOOTI@123#
      const isMatch = await bcrypt.compare(plainPassword, existingAdmin.password);
      if (!isMatch) {
        existingAdmin.password = await bcrypt.hash(plainPassword, 10);
        await existingAdmin.save();
        console.log(`[Admin Seeder] Updated password for admin: ${existingAdmin.email}`);
      } else {
        console.log(`[Admin Seeder] Admin already exists and verified: ${existingAdmin.email}`);
      }
    }
  } catch (error) {
    console.error("[Admin Seeder] Error seeding admin:", error.message);
  }
};

export default seedAdmin;
