'use server';

import { z } from 'zod';
import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const ContactSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(11),
});

export const saveContact = async (_prevState: unknown, formData: FormData) => {
    const validatedField = ContactSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedField.success) {
        return {
            Error: validatedField.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.contact.create({
            data: {
                name: validatedField.data.name,
                phone: validatedField.data.phone,
            },
        });
    } catch (error) {
        return {
            message: 'Failed to create contact data',
        };
    }

    revalidatePath('/contacts');
    redirect('/contacts');
};

export const updateContact = async (id: string, _prevState: unknown, formData: FormData) => {
    const validatedField = ContactSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedField.success) {
        return {
            Error: validatedField.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.contact.update({
            data: {
                name: validatedField.data.name,
                phone: validatedField.data.phone,
            },
            where: { id },
        });
    } catch (error) {
        return {
            message: 'Failed to update contact data',
        };
    }

    revalidatePath('/contacts');
    redirect('/contacts');
};

export const deleteContact = async (id: string) => {
    try {
        await prisma.contact.delete({
            where: { id },
        });
    } catch (error) {
        return {
            message: 'Failed to delete contact data',
        };
    }

    revalidatePath('/contacts');
};
