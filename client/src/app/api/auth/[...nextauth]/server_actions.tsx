"use server"
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function authenticate_user(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  // Check if the user is a Google user
  if (user.type === 'GOOGLE') {
    return null
  }

  // Check that the password is valid
  const passwordValid = await bcrypt.compare(password, user.password!);
  if (!passwordValid) {
    return null;
  }

  // Return the user
  return user;
}

export const handle_google_login = async (account: any, profile: any) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email as string },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          id: account.providerAccountId,
          name: profile.name,
          email: profile.email,
          type: 'GOOGLE',
        },
      });
      return { id: newUser.id, name: newUser.name, email: newUser.email };
    } 

    if (existingUser.type !== 'GOOGLE') {
      console.error("A local user with the same email already exists.");
      return false;
    }

    return { id: existingUser.id, name: existingUser.name, email: existingUser.email};
  } catch (error) {
    console.error("Google login error:", error);
    return false;
  }
};