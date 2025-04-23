import prisma from "../db.js";

export const getVehicleTypes = async (req, res) => {
  try {
    let wheelCount = undefined;
    // Check if wheelCount query parameter exists and is not empty
    if (req.query.wheelCount && req.query.wheelCount.trim() !== '') {
      // Use Number.parseInt with radix 10 and trim whitespace
      const parsedWheelCount = Number.parseInt(req.query.wheelCount.trim(), 10);
      // Check if parsing resulted in a valid integer (not NaN)
      if (!Number.isNaN(parsedWheelCount)) {
        wheelCount = parsedWheelCount;
      } else {
        // Log a warning if the input was invalid, but proceed without filter
        console.warn(`Invalid wheelCount received: ${req.query.wheelCount}`);
      }
    }
    // Log the effective wheelCount being used for the query
    console.log(`Fetching vehicle types with wheelCount: ${wheelCount === undefined ? 'any' : wheelCount}`);

    // Prepare Prisma query options
    const queryOptions = {
      orderBy: { name: "asc" },
    };

    // Add where clause only if wheelCount is a valid number
    if (wheelCount !== undefined) {
      queryOptions.where = { wheelCount };
    }

    // Fetch vehicle types using the constructed options
    const vehicleTypes = await prisma.vehicleType.findMany(queryOptions);

    console.log("Fetched vehicleTypes count:", vehicleTypes.length); // Log count instead of full array
    res.status(200).json(vehicleTypes);
  } catch (error) {
    console.error("Error fetching vehicle types:", error); // Log the actual Prisma error
    // Include more error details in development for easier debugging
    const errorMessage = process.env.NODE_ENV === "development" ? error.message : "Failed to fetch vehicle types";
    res.status(500).json({ message: errorMessage });
  }
};

export const getVehicles = async (req, res) => {
  try {
    let vehicleTypeId = undefined;
    // Check if vehicleTypeId query parameter exists and is not empty
    if (req.query.vehicleTypeId && req.query.vehicleTypeId.trim() !== '') {
      const parsedTypeId = Number.parseInt(req.query.vehicleTypeId.trim(), 10);
      if (!Number.isNaN(parsedTypeId)) {
        vehicleTypeId = parsedTypeId;
      } else {
        console.warn(`Invalid vehicleTypeId received: ${req.query.vehicleTypeId}`);
      }
    }
    
    // Log what we're attempting to fetch
    console.log(`Fetching vehicles with vehicleTypeId: ${vehicleTypeId === undefined ? 'any' : vehicleTypeId}`);
    
    // Prepare Prisma query options
    const queryOptions = {
      include: { vehicleType: true },
      orderBy: { name: 'asc' },
    };
    
    // Add where clause only if vehicleTypeId is a valid number
    if (vehicleTypeId !== undefined) {
      queryOptions.where = { vehicleTypeId };
    }
    
    const vehicles = await prisma.vehicle.findMany(queryOptions);
    console.log("Fetched vehicles count:", vehicles.length);
    
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
    // Safely parse the ID parameter
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
