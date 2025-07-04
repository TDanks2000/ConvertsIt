import type { ConversionOptions, ConversionResult, ImageFile } from "../types";
import { convertImage as _convertImage } from "./image-converter-logic";
import { downloadAllAsZip as _downloadAllAsZip } from "./image-downloader";
import {
	createImageFile as _createImageFile,
	downloadImage as _downloadImage,
	formatFileSize as _formatFileSize,
	generateId as _generateId,
	isValidImageType as _isValidImageType,
} from "./image-utilities";

export namespace ImageConverter {
	export const convertImage = _convertImage;
	export const formatFileSize = _formatFileSize;
	export const generateId = _generateId;
	export const isValidImageType = _isValidImageType;
	export const createImageFile = _createImageFile;
	export const downloadImage = _downloadImage;
	export const downloadAllAsZip = _downloadAllAsZip;
}

export type { ConversionOptions, ConversionResult, ImageFile };
