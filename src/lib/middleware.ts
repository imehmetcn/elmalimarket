import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, requireAdmin, AuthUser } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser;
}

// Authentication middleware
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await authenticateUser(request);
  
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Giriş yapmanız gerekiyor' },
      { status: 401 }
    );
  }

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = user;

  return handler(authenticatedRequest);
}

// Admin authentication middleware
export async function withAdminAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await authenticateUser(request);
  
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Giriş yapmanız gerekiyor' },
      { status: 401 }
    );
  }

  if (!requireAdmin(user)) {
    return NextResponse.json(
      { success: false, message: 'Bu işlem için admin yetkisi gerekiyor' },
      { status: 403 }
    );
  }

  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = user;

  return handler(authenticatedRequest);
}

// Optional authentication middleware (kullanıcı giriş yapmış olabilir veya olmayabilir)
export async function withOptionalAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await authenticateUser(request);
  
  const authenticatedRequest = request as AuthenticatedRequest;
  if (user) {
    authenticatedRequest.user = user;
  }

  return handler(authenticatedRequest);
}