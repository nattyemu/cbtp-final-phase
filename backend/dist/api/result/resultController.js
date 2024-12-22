import { prisma } from "../../config/prisma.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { ErrorCode } from "../../exceptions/root.js";
import resultSchema from "./resultSchema.js";
const resultController = {
    addRequest: async (req, res, next) => {
        resultSchema.addRequest.parse(req.body);
        const resultExist = await prisma.requestResult.findMany({
            where: {
                id: +req.body.requestId,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                request: true
            },
        });
        if (!resultExist) {
            return next(new UnprocessableEntity("no request found in this id", 404, ErrorCode.USER_NOT_FOUND, null));
        }
        const updateresult = await prisma.requestResult.create({
            data: {
                result: req.body.result,
                userId: req.user.id,
                description: req.body.description,
                requestId: req.body.requestId,
            }
        });
        return res.status(200).json(updateresult);
    },
    updateRequest: async (req, res, next) => {
        const resultExist = await prisma.requestResult.findMany({
            where: {
                id: +req.params.id,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                request: true
            },
        });
        if (!resultExist) {
            return next(new UnprocessableEntity("no request found in this id", 404, ErrorCode.USER_NOT_FOUND, null));
        }
        const updateresult = await prisma.requestResult.update({
            where: {
                id: +req.body.id
            },
            data: {
                userId: +req.user.id,
                description: req.body.description,
                requestId: req.body.requestId,
            }
        });
        return res.status(200).json(updateresult);
    },
    deleteRequest: async (req, res, next) => {
        const resultExist = await prisma.requestResult.findMany({
            where: {
                id: +req.params.id,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                request: true
            },
        });
        if (!resultExist) {
            return next(new UnprocessableEntity("no request found in this id", 404, ErrorCode.USER_NOT_FOUND, null));
        }
        const deleteresult = await prisma.requestResult.delete({
            where: {
                id: +req.body.id
            }
        });
        return res.status(200).json(deleteresult);
    },
    getAll: async (req, res, next) => {
        const resultExist = await prisma.requestResult.findMany({
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                request: true,
            },
        });
        return res.status(200).json(resultExist);
    },
    getSingle: async (req, res, next) => {
        const resultExist = await prisma.requestResult.findMany({
            where: {
                id: +req.params.id,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                request: true
            },
        });
        return res.status(200).json(resultExist);
    },
};
export default resultController;
