import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query || typeof query !== "string") {
            return NextResponse.json({ message: "Thiếu chuỗi tìm kiếm" }, { status: 400 });
        }

        const users = await prisma.user.findMany({
            where: {
                email: {
                    contains: query,
                    mode: "insensitive", // Không phân biệt hoa thường
                },
            },
            select: {
                id: true,
                email: true,
                created_at: true,
            },
        });

        if (users.length === 0) {
            return NextResponse.json({ message: "Không tìm thấy người dùng nào!", users: [] }, { status: 200 });
        }

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Lỗi khi tìm kiếm user:", error);
        return NextResponse.json({ message: "Lỗi server!" }, { status: 500 });
    }
}
