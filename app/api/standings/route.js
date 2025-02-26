import { promises as fs } from "fs";
import path from "path";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const track = searchParams.get("track");
  console.log("Track received:", track); // Verificar si llega correctamente

  try {
    const directory = path.join(process.cwd(), "data", "daytona500");
    // Leer todos los archivos en el directorio
    const files = await fs.readdir(directory);
    let pointsMap = new Map();
    let positionMap = new Map();
    const driverWins = new Map();
    const driverRaces = new Map();
    const lapsLedMap = new Map();
    const overallRanking = new Map();

    for (const file of files) {
      if (!file.endsWith(".json")) continue; // Ignorar archivos no JSON

      const filePath = path.join(directory, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const raceData = JSON.parse(fileContent);

      const addPoints = (driver, points, lapsLed = 0) => {
        const currentPoints = pointsMap.get(driver) || 0;
        const extraPoint = lapsLed > 0 ? 1 : 0; // Add 1 point if lapsLed > 0
        pointsMap.set(driver, currentPoints + points + extraPoint);
      };

      // Sumar puntos de cada carrera
      raceData.duel1.forEach(({ driver, points }) => addPoints(driver, points));
      raceData.duel2.forEach(({ driver, points }) => addPoints(driver, points));

      raceData.stage1.forEach(({ driver, points }) =>
        addPoints(driver, points)
      );
      raceData.stage2.forEach(({ driver, points }) =>
        addPoints(driver, points)
      );

      raceData.results.forEach(({ driver, pointsRace, position, lapsLed }) => {
        addPoints(driver, pointsRace, lapsLed);
        if (!positionMap.has(driver)) {
          positionMap.set(driver, []);
        }
        positionMap.get(driver).push(position);

        // Count wins (if position is 1)
        if (position === 1) {
          driverWins.set(driver, (driverWins.get(driver) || 0) + 1);
        }

        // Count number of races the driver has participated in
        driverRaces.set(driver, (driverRaces.get(driver) || 0) + 1);

        //Count lapsLed by driver
        const currentMax = lapsLedMap.get(driver) || 0;
        lapsLedMap.set(driver, Math.max(currentMax, lapsLed));
      });
    }

    // Convertir el Map a un array ordenado

    const standings = Array.from(pointsMap.entries())
      .map(([driver, points]) => ({
        driver,
        points,
        wins: driverWins.get(driver) || 0,
        races: driverRaces.get(driver) || 0,
      }))
      .sort((a, b) => b.points - a.points || b.wins - a.wins);

    // Agregar propiedad position
    standings.forEach((item, index) => {
      item.position = index + 1;
    });

    const positions = Array.from(positionMap.entries())
      .map(([driver, positions]) => {
        const total = positions.reduce((sum, pos) => sum + pos, 0);
        const average = (total / positions.length).toFixed(2);
        return { driver, average };
      })
      .sort((a, b) => a.average - b.average);

    // Agregar propiedad position
    positions.forEach((item, index) => {
      item.position = index + 1;
    });

    // Calcular los mejores promedios de posiciones
    let bestAverages = [];

    positionMap.forEach((positions, driver) => {
      // Ordenar de mejor a peor (posición más baja es mejor)
      positions.sort((a, b) => a - b);

      // Si tiene menos de 3 carreras, completar con posiciones ficticias (50)
      while (positions.length < 3) {
        positions.push(50);
      }

      const best = positions[0];
      const second = positions[1];
      const third = positions[2];
      const average = ((best + second + third) / 3).toFixed(2); // Promedio de las mejores 3

      bestAverages.push({ driver, average, best, second, third });
    });

    // Ordenar por mejor promedio (de menor a mayor)
    bestAverages.sort((a, b) => a.average - b.average);

    // Agregar propiedad position
    bestAverages.forEach((item, index) => {
      item.position = index + 1;
    });

    // Ordenar pilotos con mas vueltas lideradas
    const lapsLedStandings = [...lapsLedMap.entries()]
      .sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor
      .map(([driver, lapsLed], index) => ({
        position: index + 1,
        driver,
        lapsLed,
      }));

    // Recorrer cada tabla de posiciones
    [standings, positions, bestAverages].forEach((ranking) => {
      ranking.forEach((item, index) => {
        const driver = item.driver; // Asegurar que estamos obteniendo el nombre correctamente
        const position = index + 1;

        if (!driver) return; // Evitar errores si el nombre no está definido

        overallRanking.set(
          driver,
          (overallRanking.get(driver) || 0) + position
        );
      });
    });

    // Convertir a array, calcular el promedio y ordenar de menor a mayor
    const finalRanking = Array.from(overallRanking, ([driver, total]) => ({
      driver,
      average: (total / 3).toFixed(2),
    })).sort((a, b) => a.average - b.average);

    // Asignar posiciones finales
    finalRanking.forEach((item, index) => {
      item.position = index + 1;
    });

    return Response.json({
      standings,
      positions,
      bestAverages,
      lapsLedStandings,
      finalRanking,
    });
  } catch (error) {
    return Response.json(
      { error: "Error al leer los archivos JSON" },
      { status: 500 }
    );
  }
}
