import { NextRequest, NextResponse } from 'next/server';
import { getUserOrders } from '@/lib/db-actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const orders = await getUserOrders(parseInt(userId));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
