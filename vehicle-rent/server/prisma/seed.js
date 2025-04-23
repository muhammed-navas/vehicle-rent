import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.vehicleType.deleteMany({});

    console.log("Seeding database...");

    // Create vehicle types for cars (4 wheels)
    await prisma.vehicleType.create({
      data: {
        name: "Sedan",
        wheelCount: 4,
      },
    });

    await prisma.vehicleType.create({
      data: {
        name: "SUV",
        wheelCount: 4,
      },
    });
     await prisma.vehicleType.create({
       data: {
         name: "Hatchback",
         wheelCount: 4,
       },
     });

    // Create vehicle types for motorcycles (2 wheels)
    await prisma.vehicleType.create({
      data: {
        name: "Sport Bike",
        wheelCount: 2,
      },
    });

    await prisma.vehicleType.create({
      data: {
        name: "Cruiser",
        wheelCount: 2,
      },
    });

    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
