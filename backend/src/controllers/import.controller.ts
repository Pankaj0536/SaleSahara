import { Request, Response, NextFunction } from 'express';
import { ImportService } from '../services/import.service';
import { sendSuccess, sendError } from '../utils/response';

export class ImportController {
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return sendError(res, 'FILE_REQUIRED', 'Please upload a CSV or Excel file.', 400);
      }

      const result = await ImportService.processImport(
        req.user!.organizationId,
        req.user!.userId,
        req.file.originalname,
        req.file.mimetype,
        req.file.buffer
      );

      return sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
      const status = await ImportService.getImportStatus(
        jobId,
        req.user!.organizationId
      );
      if (!status) return sendError(res, 'JOB_NOT_FOUND', 'Import job not found.', 404);
      return sendSuccess(res, status);
    } catch (error) {
      next(error);
    }
  }
}
