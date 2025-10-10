"use client";

import { useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Switch,
} from "@heroui/react";

export default function UserProfileFormsPage() {
  return (
    <div className="w-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">User & Profile Management</h1>
        <p className="text-gray-600">
          Forms for managing user profiles, personal information, password
          changes, and notification preferences.
        </p>
      </div>

      <Tabs aria-label="User & Profile forms">
        <Tab key="profile" title="User Profile">
          <UserProfileForm />
        </Tab>
        <Tab key="password" title="Change Password">
          <ChangePasswordForm />
        </Tab>
        <Tab key="notifications" title="Notification Settings">
          <NotificationSettingsForm />
        </Tab>
      </Tabs>
    </div>
  );
}

function UserProfileForm() {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [bio, setBio] = useState("Software developer with a passion for building great products.");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    setTimeout(() => {
      console.log("Profile updated:", {
        firstName,
        lastName,
        email,
        phone,
        bio,
        profileImage,
      });
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  return (
    <Card className="max-w-2xl mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Edit Profile</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-gray-500">
                    {firstName[0]}
                    {lastName[0]}
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-image"
              />
              <label htmlFor="profile-image">
                <Button
                  as="span"
                  size="sm"
                  variant="bordered"
                  className="cursor-pointer"
                >
                  Change Photo
                </Button>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isRequired
              label="First Name"
              placeholder="Enter first name"
              value={firstName}
              onValueChange={setFirstName}
            />
            <Input
              isRequired
              label="Last Name"
              placeholder="Enter last name"
              value={lastName}
              onValueChange={setLastName}
            />
          </div>

          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Enter email"
            value={email}
            onValueChange={setEmail}
            isReadOnly
            description="Email cannot be changed. Contact support if you need to update it."
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={phone}
            onValueChange={setPhone}
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself"
            value={bio}
            onValueChange={setBio}
            minRows={4}
            maxRows={8}
            description={`${bio.length}/500 characters`}
            maxLength={500}
          />

          {isSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              Profile updated successfully!
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="bordered">Cancel</Button>
            <Button type="submit" color="primary" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd: string) => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(pwd)) errors.push("One special character");
    return errors;
  };

  const passwordErrors = newPassword ? validatePassword(newPassword) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    if (!currentPassword) {
      setError("Current password is required");
      setIsLoading(false);
      return;
    }

    if (passwordErrors.length > 0) {
      setError("New password does not meet requirements");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      console.log("Password changed successfully");
      setIsLoading(false);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <Card className="max-w-md mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Change Password</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            For security, you must enter your current password to change it.
          </p>

          <Input
            isRequired
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            onValueChange={setCurrentPassword}
          />

          <Input
            isRequired
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onValueChange={setNewPassword}
            isInvalid={newPassword.length > 0 && passwordErrors.length > 0}
            errorMessage={
              newPassword.length > 0 &&
              passwordErrors.length > 0 && (
                <ul className="list-disc list-inside">
                  {passwordErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )
            }
          />

          <Input
            isRequired
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            isInvalid={
              confirmPassword.length > 0 && newPassword !== confirmPassword
            }
            errorMessage={
              confirmPassword.length > 0 && newPassword !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              Password changed successfully!
            </div>
          )}

          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            className="w-full"
          >
            Change Password
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

function NotificationSettingsForm() {
  const [emailComments, setEmailComments] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [emailNewsletter, setEmailNewsletter] = useState(false);
  const [pushSystemAlerts, setPushSystemAlerts] = useState(true);
  const [pushMessages, setPushMessages] = useState(true);
  const [pushActivity, setPushActivity] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    setTimeout(() => {
      console.log("Notification settings updated:", {
        email: { emailComments, emailUpdates, emailNewsletter },
        push: { pushSystemAlerts, pushMessages, pushActivity },
        sms: { smsAlerts },
      });
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  return (
    <Card className="max-w-2xl mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Comments</p>
                    <p className="text-sm text-gray-600">
                      Get notified when someone comments on your posts
                    </p>
                  </div>
                  <Switch
                    isSelected={emailComments}
                    onValueChange={setEmailComments}
                  />
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Product Updates</p>
                    <p className="text-sm text-gray-600">
                      Receive updates about new features and improvements
                    </p>
                  </div>
                  <Switch
                    isSelected={emailUpdates}
                    onValueChange={setEmailUpdates}
                  />
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-gray-600">
                      Subscribe to our weekly newsletter
                    </p>
                  </div>
                  <Switch
                    isSelected={emailNewsletter}
                    onValueChange={setEmailNewsletter}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Push Notifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">System Alerts</p>
                    <p className="text-sm text-gray-600">
                      Important system notifications and alerts
                    </p>
                  </div>
                  <Switch
                    isSelected={pushSystemAlerts}
                    onValueChange={setPushSystemAlerts}
                  />
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-gray-600">
                      Get notified when you receive a new message
                    </p>
                  </div>
                  <Switch
                    isSelected={pushMessages}
                    onValueChange={setPushMessages}
                  />
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Activity</p>
                    <p className="text-sm text-gray-600">
                      Updates about activity on your account
                    </p>
                  </div>
                  <Switch
                    isSelected={pushActivity}
                    onValueChange={setPushActivity}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">SMS Notifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Critical Alerts</p>
                    <p className="text-sm text-gray-600">
                      Receive text messages for critical alerts only
                    </p>
                  </div>
                  <Switch isSelected={smsAlerts} onValueChange={setSmsAlerts} />
                </div>
              </div>
            </div>
          </div>

          {isSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              Notification settings saved successfully!
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="bordered">Reset to Defaults</Button>
            <Button type="submit" color="primary" isLoading={isLoading}>
              Save Preferences
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
