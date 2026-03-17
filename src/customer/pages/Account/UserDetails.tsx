import { useState } from "react";
import { Button, CircularProgress, Divider, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateUserProfile } from "../../../Redux Toolkit/Customer/UserSlice";

const UserDetails = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store);

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user.user?.fullName || "");
  const [mobile, setMobile] = useState(user.user?.mobile || "");
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setFullName(user.user?.fullName || "");
    setMobile(user.user?.mobile || "");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    const jwt = localStorage.getItem("jwt") || "";
    if (!jwt) return;

    setSaving(true);
    try {
      await dispatch(
        updateUserProfile({ fullName, mobile, jwt })
      ).unwrap();
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="w-full lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">
            Personal Details
          </h1>
          {!editing && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              size="small"
            >
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-0">
          {/* Name */}
          <div className="p-5 flex items-center bg-slate-50">
            <p className="w-20 lg:w-36 pr-5">Name</p>
            <Divider orientation="vertical" flexItem />
            <div className="pl-4 lg:pl-10 flex-1">
              {editing ? (
                <TextField
                  size="small"
                  fullWidth
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                />
              ) : (
                <p className="font-semibold lg:text-lg">
                  {user.user?.fullName || "N/A"}
                </p>
              )}
            </div>
          </div>
          <Divider />

          {/* Email (read-only) */}
          <div className="p-5 flex items-center bg-slate-50">
            <p className="w-20 lg:w-36 pr-5">Email</p>
            <Divider orientation="vertical" flexItem />
            <p className="pl-4 lg:pl-10 font-semibold lg:text-lg">
              {user.user?.email || "N/A"}
            </p>
          </div>
          <Divider />

          {/* Mobile */}
          <div className="p-5 flex items-center bg-slate-50">
            <p className="w-20 lg:w-36 pr-5">Mobile</p>
            <Divider orientation="vertical" flexItem />
            <div className="pl-4 lg:pl-10 flex-1">
              {editing ? (
                <TextField
                  size="small"
                  fullWidth
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                />
              ) : (
                <p className="font-semibold lg:text-lg">
                  {user.user?.mobile || "N/A"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Save / Cancel */}
        {editing && (
          <div className="flex gap-3 mt-5 justify-end">
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CloseIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={
                saving ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
