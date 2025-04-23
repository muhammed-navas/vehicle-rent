import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await prisma.vehicle.deleteMany({});
    await prisma.vehicleType.deleteMany({});
    
    console.log("Seeding database...");
    
    // Create vehicle types for cars (4 wheels)
    const sedan = await prisma.vehicleType.create({
      data: {
        name: "Sedan",
        wheelCount: 4,
      },
    });
    
    const suv = await prisma.vehicleType.create({
      data: {
        name: "SUV",
        wheelCount: 4,
      },
    });
    
    const hatchback = await prisma.vehicleType.create({
      data: {
        name: "Hatchback",
        wheelCount: 4,
      },
    });
    
    // Create vehicle types for motorcycles (2 wheels)
    const sportBike = await prisma.vehicleType.create({
      data: {
        name: "Sport Bike",
        wheelCount: 2,
      },
    });
    
    const cruiser = await prisma.vehicleType.create({
      data: {
        name: "Cruiser",
        wheelCount: 2,
      },
    });
    
    // Create actual vehicles
    await prisma.vehicle.create({
      data: {
        name: "Toyota Camry",
        vehicleTypeId: sedan.id,
      },
    });
    
    await prisma.vehicle.create({
      data: {
        name: "Honda Accord",
        vehicleTypeId: sedan.id,
      },
    });
    
    await prisma.vehicle.create({
      data: {
        name: "Ford Explorer",
        vehicleTypeId: suv.id,
      },
    });
    
    await prisma.vehicle.create({
      data: {
        name: "Toyota RAV4",
        vehicleTypeId: suv.id,
      },
    });
    
    await prisma.vehicle.create({
      data: {
        name: "Volkswagen Golf",
        vehicleTypeId: hatchback.id,
      },
    });
    
    await prisma.vehicle.create({
      data: {
        name: "Kawasaki Ninja",
        vehicleTypeId: sportBike.id,
      },
    });
    
    await prisma.vehicle.create({
      data: {
        name: "Harley Davidson Street Glide",
        vehicleTypeId: cruiser.id,
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
