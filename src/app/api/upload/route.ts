import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware';
import { 
  extractFilesFromFormData, 
  uploadMultipleFiles, 
  UploadedFile 
} from '@/lib/upload';

// POST /api/upload - Dosya yükleme (admin)
export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (req: AuthenticatedRequest) => {
    try {
      // FormData'dan dosyaları çıkar
      const files = await extractFilesFromFormData(request);

      if (files.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Yüklenecek dosya bulunamadı',
          },
          { status: 400 }
        );
      }

      // Maksimum 5 dosya kontrolü
      if (files.length > 5) {
        return NextResponse.json(
          {
            success: false,
            message: 'Maksimum 5 dosya yükleyebilirsiniz',
          },
          { status: 400 }
        );
      }

      // Dosyaları yükle
      const uploadedFiles: UploadedFile[] = await uploadMultipleFiles(files, 'products');

      return NextResponse.json({
        success: true,
        message: `${uploadedFiles.length} dosya başarıyla yüklendi`,
        data: {
          files: uploadedFiles.map(file => ({
            filename: file.filename,
            originalName: file.originalName,
            url: file.url,
            size: file.size,
          })),
        },
      });
    } catch (error) {
      console.error('Upload API hatası:', error);
      return NextResponse.json(
        {
          success: false,
          message: error instanceof Error ? error.message : 'Dosya yükleme hatası',
        },
        { status: 500 }
      );
    }
  });
}