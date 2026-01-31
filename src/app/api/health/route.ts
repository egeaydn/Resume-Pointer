import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * 
 * Used for monitoring and uptime checks.
 * Returns application health status and metadata.
 * 
 * @endpoint GET /api/health
 * @returns {Object} Health status information
 */
export async function GET() {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      checks: {
        api: 'operational',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB',
        },
      },
    };

    return NextResponse.json(health, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}
