import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { BillStatus, TBill } from "@/ProjectType";
import { billsService } from "@/services/billsService";

type Props = {
  bills: TBill[];
  setBills: React.Dispatch<React.SetStateAction<TBill[]>>;
};

const CreateBillDialog = (props: Props) => {
  const { bills, setBills } = props;
  const [roommates, setRoommates] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");
  const [billName, setBillName] = useState("");

  const addMember = () => {
    if (newMember && !roommates.includes(newMember)) {
      setRoommates([...roommates, newMember]);
      setNewMember("");
    }
  };

  const deleteMember = (memberToDelete: string) => {
    if (roommates.length > 1) {
      setRoommates(roommates.filter((member) => member !== memberToDelete));
    }
  };

  const createNewBill = () => {
    const newBill = {
      id: Date.now(),
      name: billName,
      createdAt: new Date().toISOString(),
      status: BillStatus.Active,
      expenses: [],
      members: roommates,
    };
    try {
      billsService.createBill(newBill);
      setBills([...bills, newBill]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Create New Bill</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-y-4">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Bill's name"
          onChange={(e) => setBillName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <Label htmlFor="username">Roommates</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="New member name"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={addMember}
            className="bg-black text-white cursor-pointer hover:bg-gray-800"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {roommates.map((member) => (
            <div
              key={member}
              className="flex items-center gap-2 bg-blue-300 px-3 py-1 rounded-full"
            >
              <span>{member}</span>
              <button
                onClick={() => deleteMember(member)}
                className="text-gray-500 hover:text-red-500"
                disabled={roommates.length <= 1}
              >
                <X className="w-4 h-4 cursor-pointer" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="submit"
            className="bg-black text-white cursor-pointer hover:bg-gray-800"
            onClick={createNewBill}
          >
            Save changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateBillDialog;
