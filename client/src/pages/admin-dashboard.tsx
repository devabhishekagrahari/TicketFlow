import { ROUTES, BUSES } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bus, Map, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage your fleet, routes, and agents.</p>
        </div>
      </div>

      <Tabs defaultValue="buses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="buses" className="gap-2"><Bus className="h-4 w-4"/> Buses</TabsTrigger>
          <TabsTrigger value="routes" className="gap-2"><Map className="h-4 w-4"/> Routes</TabsTrigger>
          <TabsTrigger value="agents" className="gap-2"><Users className="h-4 w-4"/> Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="buses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fleet Management</CardTitle>
              <Button size="sm">Add New Bus</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bus Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Total Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BUSES.map(bus => (
                    <TableRow key={bus.id}>
                      <TableCell className="font-medium">{bus.name}</TableCell>
                      <TableCell>{bus.type}</TableCell>
                      <TableCell>{bus.plateNumber}</TableCell>
                      <TableCell>{bus.totalSeats}</TableCell>
                      <TableCell><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Route Management</CardTitle>
              <Button size="sm">Add New Route</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROUTES.slice(0, 5).map(route => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.source}</TableCell>
                      <TableCell>{route.destination}</TableCell>
                      <TableCell>{new Date(route.departureTime).toLocaleTimeString()}</TableCell>
                      <TableCell>${route.price}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Registered Agents</CardTitle>
              <Button size="sm">Add Agent</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Agent Smith</TableCell>
                    <TableCell>smith@agency.com</TableCell>
                    <TableCell>$12,450</TableCell>
                    <TableCell>8%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Travel Pro LLC</TableCell>
                    <TableCell>contact@travelpro.com</TableCell>
                    <TableCell>$45,200</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
