import { Request, Response } from "express";
import Property from "../models/property";
import z, { string } from "zod";

const propertySchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(1000),
    village: z.string().max(100).optional(),
    adress: z.object({
        street: z.string().max(100).optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(100).optional(),
        zipCode: z.string().max(20).optional(),
        coordinates: z.object({
            type: z.literal('Point'),
            coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
        }).optional(),
        price: z.object({   
            amount: z.number().positive(),
            period: z.enum(['monthly', 'yearly']),
        }),
        propertyType: z.enum(['apartment', 'house', 'studio']),
        amenities: z.array(z.string()).optional(),
        isAvailable: z.boolean(),
        isVerified: z.boolean(),
        propertyImages: z.array(z.string()).optional(),
    }),
});

export const createProperty = async (req: Request, res: Response) => {
    const userId = (req as any).user?.sub;
    const parsed = propertySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid property data", errors: parsed.error.issues });
    }
    const prop = new Property({
        ...parsed.data,
        ownerID: userId,
    });

    try {
        const savedProperty = await prop.save();
        res.status(201).json(savedProperty);
    } catch (error) {
        res.status(500).json({ message: "Error creating property", error });
    }
}

export const listProperties =async (req:Request, res:Response) => {
   const { city, state, propertyType, minPrice, maxPrice,propertyImages } = req.query as any;
   const filter: any = {};
    if (city) filter['adress.city'] = city;
    if (state) filter['adress.state'] = state;
    if (propertyType) filter['adress.propertyType'] = propertyType;
    if (minPrice) filter['adress.price.amount'] = { ...filter['adress.price.amount'], $gte: Number(minPrice) };
    if (maxPrice) filter['adress.price.amount'] = { ...filter['adress.price.amount'], $lte: Number(maxPrice) };
    const properties = await Property.find(filter);
    res.json(properties);
}

export const getProperty = async (req:Request, res:Response) => {
    const propertyId = req.params.id;
    try {
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json(property);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving property", error });
    }
}

export const updateProperty = async (req:Request, res:Response) => {
    const propertyId = req.params.id;
    const parsed = propertySchema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid property data", errors: parsed.error.issues });
    }
    try {
        const updatedProperty = await Property.findByIdAndUpdate(propertyId, parsed.data, { new: true });
        if (!updatedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json(updatedProperty);
    } catch (error) {
        res.status(500).json({ message: "Error updating property", error });
    }
}

export const deleteProperty = async (req:Request, res:Response) => {
    const propertyId = req.params.id;
    try {
        const deletedProperty = await Property.findByIdAndDelete(propertyId);
        if (!deletedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.json({ message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting property", error });
    }
}

