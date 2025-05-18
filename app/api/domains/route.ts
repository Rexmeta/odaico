import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// PrismaClient를 싱글톤으로 관리
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// GET /api/domains
export async function GET() {
  try {
    // 데이터베이스 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    const domains = await prisma.domain.findMany({
      orderBy: {
        id: 'desc'
      }
    });
    return NextResponse.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { error: '도메인 목록을 가져오는데 실패했습니다', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/domains
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, expiryDate, nameserver } = body;

    if (!name) {
      return NextResponse.json(
        { error: '도메인 이름은 필수입니다' },
        { status: 400 }
      );
    }

    const domain = await prisma.domain.create({
      data: {
        name,
        expiryDate: expiryDate || new Date().toISOString(),
        nameserver: nameserver || '',
        status: '사용중',
        isDelegated: false
      }
    });

    return NextResponse.json(domain);
  } catch (error) {
    console.error('Error creating domain:', error);
    return NextResponse.json(
      { error: '도메인 생성에 실패했습니다', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/domains/:id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: '도메인 ID는 필수입니다' },
        { status: 400 }
      );
    }

    const domain = await prisma.domain.update({
      where: { id },
      data
    });

    return NextResponse.json(domain);
  } catch (error) {
    console.error('Error updating domain:', error);
    return NextResponse.json(
      { error: '도메인 수정에 실패했습니다', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/domains/:id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '도메인 ID는 필수입니다' },
        { status: 400 }
      );
    }

    await prisma.domain.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting domain:', error);
    return NextResponse.json(
      { error: '도메인 삭제에 실패했습니다', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 