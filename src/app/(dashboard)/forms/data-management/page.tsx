"use client";

import { useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

export default function DataManagementFormsPage() {
  return (
    <div className="w-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Data Management (CRUD) Forms</h1>
        <p className="text-gray-600">
          Generic forms for creating, editing, and deleting items like projects,
          tasks, customers, and products.
        </p>
      </div>

      <Tabs aria-label="Data management forms">
        <Tab key="create" title="Create Form">
          <CreateEditForm mode="create" />
        </Tab>
        <Tab key="edit" title="Edit Form">
          <CreateEditForm mode="edit" />
        </Tab>
        <Tab key="delete" title="Delete Confirmation">
          <DeleteConfirmationDemo />
        </Tab>
      </Tabs>
    </div>
  );
}

interface CreateEditFormProps {
  mode: "create" | "edit";
}

function CreateEditForm({ mode }: CreateEditFormProps) {
  const [formData, setFormData] = useState({
    name: mode === "edit" ? "Sample Project" : "",
    category: mode === "edit" ? "development" : "",
    status: mode === "edit" ? "active" : "draft",
    priority: mode === "edit" ? "medium" : "low",
    description: mode === "edit" ? "This is a sample project description." : "",
    dueDate: mode === "edit" ? "2025-12-31" : "",
    budget: mode === "edit" ? "10000" : "",
    assignee: mode === "edit" ? "john" : "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    setTimeout(() => {
      console.log(`${mode === "create" ? "Created" : "Updated"} item:`, formData);
      setIsLoading(false);
      setIsSaved(true);
      if (mode === "create") {
        setFormData({
          name: "",
          category: "",
          status: "draft",
          priority: "low",
          description: "",
          dueDate: "",
          budget: "",
          assignee: "",
        });
      }
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  const categories = [
    { key: "development", label: "Development" },
    { key: "design", label: "Design" },
    { key: "marketing", label: "Marketing" },
    { key: "sales", label: "Sales" },
    { key: "support", label: "Support" },
  ];

  const statuses = [
    { key: "draft", label: "Draft" },
    { key: "active", label: "Active" },
    { key: "on-hold", label: "On Hold" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const priorities = [
    { key: "low", label: "Low" },
    { key: "medium", label: "Medium" },
    { key: "high", label: "High" },
    { key: "urgent", label: "Urgent" },
  ];

  const assignees = [
    { key: "john", label: "John Doe" },
    { key: "jane", label: "Jane Smith" },
    { key: "bob", label: "Bob Johnson" },
    { key: "alice", label: "Alice Williams" },
  ];

  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">
          {mode === "create" ? "Create New Item" : "Edit Item"}
        </h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isRequired
              label="Project Name"
              placeholder="Enter project name"
              value={formData.name}
              onValueChange={(value) => handleChange("name", value)}
            />

            <Select
              isRequired
              label="Category"
              placeholder="Select category"
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleChange("category", value);
              }}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.key}>{cat.label}</SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Status"
              placeholder="Select status"
              selectedKeys={formData.status ? [formData.status] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleChange("status", value);
              }}
            >
              {statuses.map((status) => (
                <SelectItem key={status.key}>{status.label}</SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Priority"
              placeholder="Select priority"
              selectedKeys={formData.priority ? [formData.priority] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleChange("priority", value);
              }}
            >
              {priorities.map((priority) => (
                <SelectItem key={priority.key}>{priority.label}</SelectItem>
              ))}
            </Select>

            <Input
              type="date"
              label="Due Date"
              placeholder="Select due date"
              value={formData.dueDate}
              onValueChange={(value) => handleChange("dueDate", value)}
            />

            <Input
              type="number"
              label="Budget"
              placeholder="Enter budget"
              value={formData.budget}
              onValueChange={(value) => handleChange("budget", value)}
              startContent={<span className="text-gray-500">$</span>}
            />
          </div>

          <Select
            label="Assignee"
            placeholder="Select assignee"
            selectedKeys={formData.assignee ? [formData.assignee] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handleChange("assignee", value);
            }}
          >
            {assignees.map((assignee) => (
              <SelectItem key={assignee.key}>{assignee.label}</SelectItem>
            ))}
          </Select>

          <Textarea
            label="Description"
            placeholder="Enter project description"
            value={formData.description}
            onValueChange={(value) => handleChange("description", value)}
            minRows={4}
            maxRows={8}
          />

          {isSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {mode === "create"
                ? "Item created successfully!"
                : "Item updated successfully!"}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="bordered">Cancel</Button>
            <Button type="submit" color="primary" isLoading={isLoading}>
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function DeleteConfirmationDemo() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState("Sample Project #42");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      console.log("Deleted item:", selectedItem);
      setIsDeleting(false);
      setIsDeleted(true);
      setTimeout(() => {
        setIsDeleted(false);
        onOpenChange();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="mt-4">
      <Card className="max-w-2xl">
        <CardHeader>
          <h2 className="text-xl font-semibold">Delete Item</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-gray-600">
            Click the button below to see the delete confirmation modal in action.
          </p>

          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{selectedItem}</p>
                <p className="text-sm text-gray-600">
                  Created on Jan 15, 2025 - Last updated Feb 10, 2025
                </p>
              </div>
              <Button color="danger" variant="flat" onPress={onOpen}>
                Delete
              </Button>
            </div>
          </div>

          {isDeleted && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              Item deleted successfully!
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                    <span className="text-2xl text-red-600">!</span>
                  </div>
                  <p className="text-center font-medium">
                    Are you sure you want to delete this item?
                  </p>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-center">
                      {selectedItem}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    This action cannot be undone. The item and all associated
                    data will be permanently removed from the system.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  onPress={onClose}
                  isDisabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Item"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
