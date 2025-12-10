import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DialogComponent } from "@/components/DialogComponent";
import { Room } from "@/components/Admin/Room";

const RoomListTable = ({
  headings,
  data = [],
  properties = null,
  handleSearch,
  search,
  handleSort,
  getSortIcon,
}) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedRoom) => {
    onUpdateRoom(updatedRoom);
    setIsEditDialogOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="">
      <div className=" mb-4  w-full md:w-[300px] ">
        <Input
          type="text"
          placeholder="Search rooms"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <Table className="w-full mt-5">
        <TableCaption>{data?.length} rooms found</TableCaption>
        <TableHeader>
          <TableRow>
            {headings.map((item, index) => {
              // Map heading text to data keys
              const sortableColumns = {
                "Room No": "roomNo",
                Floor: "floor",
                Status: "status",
                Hotel: "hotel",
                Category: "category",
              };

              const columnKey = sortableColumns[item];
              const isSortable = columnKey && handleSort && getSortIcon;

              return (
                <TableHead key={index} className="w-[100px]">
                  {isSortable ? (
                    <button
                      onClick={() => handleSort(columnKey)}
                      className="flex items-center hover:text-blue-600 transition-colors"
                    >
                      {item}
                      {getSortIcon(columnKey)}
                    </button>
                  ) : (
                    item
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => {
            return (
              <TableRow key={row?._id}>
                <TableCell>{row?.id}</TableCell>
                <TableCell>{row?.hotel}</TableCell>
                <TableCell>{row?.category}</TableCell>
                <TableCell>{row?.roomNo}</TableCell>
                <TableCell>{row?.floor}</TableCell>
                <TableCell className={`${properties[row.status]}`}>
                  {row?.status}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 cursor-pointer"
                    onClick={() => handleEditClick(row)}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {isEditDialogOpen && (
        <DialogComponent
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Edit Room"
          description="Make changes to the room details."
        >
          <Room
            room={selectedRoom}
            onSubmit={handleSaveEdit}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogComponent>
      )}
    </div>
  );
};

export default RoomListTable;
