// layout.tsx o layout.js (según corresponda)
// layout.tsx
'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentPathname = usePathname();
  const [currentRoute, setCurrentRoute] = useState(currentPathname); // Inicializa el estado con la ruta actual

  // Usa useEffect para observar cambios en la ruta
  useEffect(() => {
    setCurrentRoute(currentPathname);
  }, [currentPathname]);

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <ToastContainer />
        <div className="flex flex-row h-full">
          <aside style={{height:"100vh"}} className="w-64 bg-white shadow-md h-full">
            <nav>
              <ul className="space-y-2 p-4">
                <li>
                  <Link
                    className={`block py-2 px-4 rounded-md ${currentRoute === "/employee" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                      }`}
                    href={"/employee"}
                  >
                    Employees
                  </Link>
                </li>
                <li>
                  <Link
                    className={`block py-2 px-4 rounded-md ${currentRoute === "/projects" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                      }`}
                    href={"/projects"}
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    className={`block py-2 px-4 rounded-md ${currentRoute === "/tasks" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                      }`}
                    href={"/tasks"}
                  >
                    Tasks
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          <div className="flex-grow p-6">
            {children}
          </div>
        </div>
      </body>

    </html>
  );
}
