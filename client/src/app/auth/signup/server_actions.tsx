"use server"
import  prisma  from '@/lib/prisma';
import bcrypt from 'bcrypt';


export const create_user = async (name: string, email: string, password: string | Buffer) => {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if the email already exists in the User table
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { status: 400, error: 'This email is already associated with an account or to a google account.' };
  }

  // Save the user to the database
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        type: 'LOCAL',
      },
    });
    return { status: 200 };
  } catch (error) {
    console.error('An error occurred while creating the user:', error);
    return { status: 400, error: 'An error occurred while creating the user.' };
  }
};
