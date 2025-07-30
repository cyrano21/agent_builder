import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { title, description, userId } = await request.json();

    if (!title || !description || !userId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, description, and userId are required",
        },
        { status: 400 }
      );
    }

    // Validate user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const finalUserId = userId;

    // Create project in database
    const project = await db.project.create({
      data: {
        title,
        description,
        userId: finalUserId,
        status: "DRAFT",
        progress: 0,
        plan: false,
        architecture: false,
        wireframes: false,
        design: false,
        backend: false,
        devops: false,
        documentation: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform to match frontend interface
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status.toLowerCase(),
      progress: project.progress,
      createdAt: project.createdAt.toISOString().split("T")[0],
      lastModified: project.updatedAt.toISOString().split("T")[0],
      deliverables: {
        plan: project.plan,
        architecture: project.architecture,
        wireframes: project.wireframes,
        design: project.design,
        backend: project.backend,
        devops: project.devops,
        documentation: project.documentation,
      },
      user: project.user,
    };

    return NextResponse.json(transformedProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // First check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const projects = await db.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    // Transform the data to match the frontend interface
    const transformedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status.toLowerCase(),
      progress: project.progress,
      createdAt: project.createdAt.toISOString().split("T")[0],
      lastModified: project.updatedAt.toISOString().split("T")[0],
      deliverables: {
        plan: project.plan,
        architecture: project.architecture,
        wireframes: project.wireframes,
        design: project.design,
        backend: project.backend,
        devops: project.devops,
        documentation: project.documentation,
      },
      template: project.template,
      user: project.user,
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
