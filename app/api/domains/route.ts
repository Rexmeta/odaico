import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/domains
export async function GET() {
  try {
    const domains = await prisma.domain.findMany({
      orderBy: {
        id: 'desc'
      }
    });
    return NextResponse.json(domains);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
  }
}

// POST /api/domains
export async function POST(request: Request) {
  try {
    const domain = await request.json();
    const newDomain = await prisma.domain.create({
      data: {
        name: domain.name,
        expiryDate: domain.expiryDate,
        nameserver: domain.nameserver,
        status: "사용중",
        isDelegated: false
      }
    });
    return NextResponse.json(newDomain);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create domain" }, { status: 500 });
  }
}

// PUT /api/domains/:id
export async function PUT(request: Request) {
  try {
    const domain = await request.json();
    const updatedDomain = await prisma.domain.update({
      where: { id: domain.id },
      data: {
        name: domain.name,
        expiryDate: domain.expiryDate,
        nameserver: domain.nameserver,
        status: domain.status,
        isDelegated: domain.isDelegated
      }
    });
    return NextResponse.json(updatedDomain);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update domain" }, { status: 500 });
  }
}

// DELETE /api/domains/:id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    await prisma.domain.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete domain" }, { status: 500 });
  }
} 