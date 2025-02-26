"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

const TrackData = () => {
  const { track } = useParams();
  const [isVisible, setIsVisible] = useState(false);

  const [standings, setStandings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [bestAverages, setBestAverages] = useState([]);
  const [lapsLedStandings, setLapsLedStandings] = useState([]);
  const [overallRanking, setOverallRanking] = useState([]);

  useEffect(() => {
    if (!track) return;

    fetch(`/api/standings?track=${track}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        res.json();
      })
      .then((data) => {
        if (!data || data.length === 0) throw new Error("No data received");
        setStandings(data.standings);
        setPositions(data.positions);
        setBestAverages(data.bestAverages);
        setLapsLedStandings(data.lapsLedStandings);
        setOverallRanking(data.finalRanking);
      })
      .catch((err) => console.error("Error fetching standings:", err));
  }, [track]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Standings for {track}</h1>
      {/* Botón para mostrar/ocultar */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center gap-2 px-4 py-2 mb-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
      >
        {isVisible ? <FaEyeSlash /> : <FaEye />}
        {isVisible ? "Ocultar Tabla" : "Mostrar Tabla"}
      </button>

      <div className="grid grid-cols-3">
        {/* Tabla por puntos */}
        <div className="flex-col m-auto">
          <h2 className="text-md font-semibold mb-2">Ranking by points</h2>
          <table className="w-260 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-blue-600">
                <th className="border border-gray-300 dark:border-blue-800 px-4 py-2">
                  Pos.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-4 py-2">
                  Driver
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-4 py-2">
                  N° R.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-4 py-2">
                  Wins
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-4 py-2">
                  Pts
                </th>
              </tr>
            </thead>
            {isVisible && (
              <tbody>
                {standings
                  .sort((a, b) => {
                    return b.points - a.points || b.wins - a.wins;
                  })
                  .map((entry) => (
                    <tr
                      key={entry.driver}
                      className="text-center border border-gray-300"
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {entry.position}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {entry.driver}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {entry.races}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {entry.wins}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-bold">
                        {entry.points}
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Tabla por posición final en carrera */}
        <div className="flex-col m-auto">
          <h2 className="text-md font-semibold mb-2">
            Average Final Positions
          </h2>
          <table className="w-260 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-blue-600">
                <th className="border border-gray-300 dark:border-blue-800 px-4 py-2">
                  Pos.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-4 py-2">
                  Driver
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-4 py-2">
                  Avg
                </th>
              </tr>
            </thead>
            {isVisible && (
              <tbody>
                {positions.map((entry) => (
                  <tr
                    key={entry.driver}
                    className="text-center border border-gray-300"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {entry.position}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {entry.driver}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {entry.average}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Tabla de promedios de las 3 mejores posiciones */}
        <div className="flex-col m-auto">
          <h2 className="text-md font-semibold mb-2">Average Best Positions</h2>
          <table className="w-300 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-blue-600">
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Pos.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Driver
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Avg
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  1°
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  2°
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  3°
                </th>
              </tr>
            </thead>
            {isVisible && (
              <tbody>
                {bestAverages.map((entry) => (
                  <tr
                    key={entry.driver}
                    className="text-center border border-gray-300"
                  >
                    <td className="border border-gray-300 px-3 py-2">
                      {entry.position}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {entry.driver}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 font-bold">
                      {entry.average}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {entry.best}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {entry.second}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {entry.third}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Tabla de promedios final */}
        <div className="flex-col m-auto mt-12">
          <h2 className="text-md font-semibold mb-2">Final Ranking</h2>
          <table className="w-300 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-blue-600">
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Pos.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Driver
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Avg
                </th>
              </tr>
            </thead>
            <tbody>
              {overallRanking.slice(0, 60).map((entry) => (
                <tr
                  key={entry.driver}
                  className="text-center border border-gray-300"
                >
                  <td
                    className={`border border-gray-300  ${
                      entry.position < 41 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.position}
                  </td>
                  <td
                    className={`border border-gray-300  ${
                      entry.position < 41 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.driver}
                  </td>
                  <td
                    className={`border border-gray-300  ${
                      entry.position < 41 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.average}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla de vueltas lideradas */}
        <div className="flex-col m-auto mt-12">
          <h2 className="text-md font-semibold mb-2">Laps Led Standings</h2>
          <table className="w-300 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-blue-600">
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Pos.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Driver
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Laps
                </th>
              </tr>
            </thead>
            <tbody>
              {lapsLedStandings.slice(0, 20).map((entry) => (
                <tr
                  key={entry.driver}
                  className="text-center border border-gray-300"
                >
                  <td
                    className={`border border-gray-300 ${
                      entry.position < 11 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.position}
                  </td>
                  <td
                    className={`border border-gray-300 ${
                      entry.position < 11 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.driver}
                  </td>
                  <td
                    className={`border border-gray-300 ${
                      entry.position < 11 ? "bg-blue-500" : ""
                    } px-3 py-2`}
                  >
                    {entry.lapsLed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla de victorias */}
        <div className="flex-col m-auto mt-12">
          <h2 className="text-md font-semibold mb-2">Victory Table</h2>
          <table className="w-300 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 dark:bg-blue-600">
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Pos.
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Driver
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Wins
                </th>
                <th className="border border-gray-300 dark:border-blue-800 px-3 py-2">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody>
              {standings
                .sort((a, b) => {
                  return b.wins - a.wins || b.points - a.points;
                })
                .slice(0, 20)
                .map((entry, index) => (
                  <tr
                    key={entry.driver}
                    className="text-center border border-gray-300"
                  >
                    <td
                      className={`border border-gray-300 ${
                        index < 10 ? "bg-blue-500" : ""
                      } px-3 py-2`}
                    >
                      {index + 1}
                    </td>
                    <td
                      className={`border border-gray-300 ${
                        index < 10 ? "bg-blue-500" : ""
                      } px-3 py-2`}
                    >
                      {entry.driver}
                    </td>
                    <td
                      className={`border border-gray-300 ${
                        index < 10 ? "bg-blue-500" : ""
                      } px-3 py-2`}
                    >
                      {entry.wins}
                    </td>
                    <td
                      className={`border border-gray-300 ${
                        index < 10 ? "bg-blue-500" : ""
                      } px-3 py-2`}
                    >
                      {entry.points}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrackData;
