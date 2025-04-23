import prisma from "../db.js";

export const getVehicleTypes = async (req, res) => {
  try {
    let wheelCount = undefined;
    if (req.query.wheelCount && req.query.wheelCount.trim() !== '') {
      const parsedWheelCount = Number.parseInt(req.query.wheelCount.trim(), 10);
      if (!Number.isNaN(parsedWheelCount)) {
        wheelCount = parsedWheelCount;
      } else {
        console.warn(`Invalid wheelCount received: ${req.query.wheelCount}`);
      }
    }

    console.log(`Fetching vehicle types with wheelCount: ${wheelCount === undefined ? 'any' : wheelCount}`);


    const queryOptions = {
      orderBy: { name: "asc" },
    };


    if (wheelCount !== undefined) {
      queryOptions.where = { wheelCount };
    }


    const vehicleTypes = await prisma.vehicleType.findMany(queryOptions);

    console.log("Fetched vehicleTypes count:", vehicleTypes.length);
    res.status(200).json(vehicleTypes);
  } catch (error) {
    console.error("Error fetching vehicle types:", error);

    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "Failed to fetch vehicle types";
    res.status(500).json({ message: errorMessage });
  }
};

export const getVehicles = async (req, res) => {
  try {
    let vehicleTypeId = undefined;

    if (req.query.vehicleTypeId && req.query.vehicleTypeId.trim() !== '') {
      const parsedTypeId = Number.parseInt(req.query.vehicleTypeId.trim(), 10);
      if (!Number.isNaN(parsedTypeId)) {
        vehicleTypeId = parsedTypeId;
      } else {
        console.warn(`Invalid vehicleTypeId received: ${req.query.vehicleTypeId}`);
        return res.status(400).json({ message: 'Invalid vehicle type ID format' });
      }
    }
    

    console.log(`Fetching vehicles with vehicleTypeId: ${vehicleTypeId === undefined ? 'any' : vehicleTypeId}`);
    

    const queryOptions = {
      include: { vehicleType: true },
      orderBy: { name: 'asc' },
    };
    

    if (vehicleTypeId !== undefined) {
      queryOptions.where = { vehicleTypeId };
    }
    
    const vehicles = await prisma.vehicle.findMany(queryOptions);
    console.log("Fetched vehicles count:", vehicles.length);
    

    if (vehicles.length > 0) {
      console.log("Sample vehicle:", JSON.stringify(vehicles[0], null, 2));
    }
    
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "Failed to fetch vehicles";
    return res.status(500).json({ message: errorMessage });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const parsedId = Number.parseInt(id.trim(), 10);
    
    if (Number.isNaN(parsedId)) {
      console.warn(`Invalid vehicle ID received: ${id}`);
      return res.status(400).json({ message: 'Invalid vehicle ID format' });
    }
    
    console.log(`Fetching vehicle with ID: ${parsedId}`);
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parsedId },
      include: { vehicleType: true },
    });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    return res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "Failed to fetch vehicle";
    return res.status(500).json({ message: errorMessage });
  }
};
