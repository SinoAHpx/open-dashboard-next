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
  CheckboxGroup,
  Checkbox,
  Chip,
} from "@heroui/react";

export default function InteractionFilteringFormsPage() {
  return (
    <div className="w-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Interaction & Filtering</h1>
        <p className="text-gray-600">
          Forms for user interaction, data filtering, search functionality, and
          support requests.
        </p>
      </div>

      <Tabs aria-label="Interaction & Filtering forms">
        <Tab key="search" title="Search & Filter">
          <SearchFilterForm />
        </Tab>
        <Tab key="contact" title="Contact/Support">
          <ContactSupportForm />
        </Tab>
      </Tabs>
    </div>
  );
}

function SearchFilterForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleApply = async () => {
    setIsSearching(true);
    setTimeout(() => {
      console.log("Applying filters:", {
        searchQuery,
        status,
        category,
        dateFrom,
        dateTo,
        tags,
        sortBy,
      });

      const mockResults = [
        {
          id: 1,
          title: "Project Alpha",
          status: "active",
          category: "development",
          date: "2025-02-08",
          tags: ["web", "frontend"],
        },
        {
          id: 2,
          title: "Marketing Campaign",
          status: "completed",
          category: "marketing",
          date: "2025-01-15",
          tags: ["social", "ads"],
        },
        {
          id: 3,
          title: "Customer Support System",
          status: "active",
          category: "support",
          date: "2025-02-01",
          tags: ["backend", "api"],
        },
      ];

      setResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatus([]);
    setCategory("");
    setDateFrom("");
    setDateTo("");
    setTags([]);
    setSortBy("date-desc");
    setResults([]);
  };

  const categories = [
    { key: "all", label: "All Categories" },
    { key: "development", label: "Development" },
    { key: "design", label: "Design" },
    { key: "marketing", label: "Marketing" },
    { key: "sales", label: "Sales" },
    { key: "support", label: "Support" },
  ];

  const sortOptions = [
    { key: "date-desc", label: "Date (Newest First)" },
    { key: "date-asc", label: "Date (Oldest First)" },
    { key: "name-asc", label: "Name (A-Z)" },
    { key: "name-desc", label: "Name (Z-A)" },
    { key: "status-asc", label: "Status" },
  ];

  const availableTags = [
    { key: "web", label: "Web" },
    { key: "mobile", label: "Mobile" },
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend" },
    { key: "api", label: "API" },
    { key: "database", label: "Database" },
    { key: "ui-ux", label: "UI/UX" },
    { key: "social", label: "Social" },
    { key: "ads", label: "Ads" },
  ];

  return (
    <div className="space-y-6 mt-4">
      <Card className="max-w-4xl">
        <CardHeader>
          <h2 className="text-xl font-semibold">Search & Filter</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <Input
              isClearable
              label="Search"
              placeholder="Search by keyword..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              startContent={
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CheckboxGroup
                  label="Status"
                  value={status}
                  onValueChange={setStatus}
                  orientation="horizontal"
                >
                  <Checkbox value="draft">Draft</Checkbox>
                  <Checkbox value="active">Active</Checkbox>
                  <Checkbox value="completed">Completed</Checkbox>
                  <Checkbox value="cancelled">Cancelled</Checkbox>
                </CheckboxGroup>
              </div>

              <Select
                label="Category"
                placeholder="Select category"
                selectedKeys={category ? [category] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setCategory(value);
                }}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.key}>{cat.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date From"
                value={dateFrom}
                onValueChange={setDateFrom}
              />
              <Input
                type="date"
                label="Date To"
                value={dateTo}
                onValueChange={setDateTo}
              />
            </div>

            <div>
              <CheckboxGroup
                label="Tags"
                value={tags}
                onValueChange={setTags}
                orientation="horizontal"
                classNames={{
                  wrapper: "gap-2",
                }}
              >
                {availableTags.map((tag) => (
                  <Checkbox key={tag.key} value={tag.key}>
                    {tag.label}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>

            <Select
              label="Sort By"
              placeholder="Select sort order"
              selectedKeys={sortBy ? [sortBy] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setSortBy(value);
              }}
            >
              {sortOptions.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>

            <div className="flex gap-3 justify-end">
              <Button variant="bordered" onPress={handleReset}>
                Reset
              </Button>
              <Button
                color="primary"
                onPress={handleApply}
                isLoading={isSearching}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {results.length > 0 && (
        <Card className="max-w-4xl">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Search Results ({results.length})
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{result.title}</h4>
                    <Chip
                      size="sm"
                      color={
                        result.status === "active"
                          ? "success"
                          : result.status === "completed"
                            ? "primary"
                            : "default"
                      }
                    >
                      {result.status}
                    </Chip>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Category: {result.category}</span>
                    <span>Date: {result.date}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {result.tags.map((tag: string) => (
                      <Chip key={tag} size="sm" variant="flat">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function ContactSupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmitted(false);

    setTimeout(() => {
      console.log("Support request submitted:", {
        name,
        email,
        subject,
        category,
        priority,
        message,
        attachment: attachment?.name,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);

      setName("");
      setEmail("");
      setSubject("");
      setCategory("");
      setPriority("medium");
      setMessage("");
      setAttachment(null);

      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const categories = [
    { key: "technical", label: "Technical Issue" },
    { key: "billing", label: "Billing Question" },
    { key: "feature", label: "Feature Request" },
    { key: "bug", label: "Bug Report" },
    { key: "account", label: "Account Issue" },
    { key: "other", label: "Other" },
  ];

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mt-4">
        <CardBody className="text-center py-12">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-2xl font-semibold mb-2">
            Thank You for Contacting Us
          </h3>
          <p className="text-gray-600 mb-6">
            We&apos;ve received your message and will get back to you within 24
            hours. A confirmation email has been sent to your inbox.
          </p>
          <Button color="primary" onPress={() => setIsSubmitted(false)}>
            Submit Another Request
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Contact Support</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Fill out the form below and our support team will get back to you as
            soon as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              isRequired
              label="Name"
              placeholder="Enter your name"
              value={name}
              onValueChange={setName}
            />
            <Input
              isRequired
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
            />
          </div>

          <Input
            isRequired
            label="Subject"
            placeholder="Brief description of your issue"
            value={subject}
            onValueChange={setSubject}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              isRequired
              label="Category"
              placeholder="Select category"
              selectedKeys={category ? [category] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setCategory(value);
              }}
            >
              {categories.map((cat) => (
                <SelectItem key={cat.key}>{cat.label}</SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Priority"
              placeholder="Select priority"
              selectedKeys={priority ? [priority] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setPriority(value);
              }}
            >
              <SelectItem key="low">Low</SelectItem>
              <SelectItem key="medium">Medium</SelectItem>
              <SelectItem key="high">High</SelectItem>
              <SelectItem key="urgent">Urgent</SelectItem>
            </Select>
          </div>

          <Textarea
            isRequired
            label="Message"
            placeholder="Please describe your issue in detail..."
            value={message}
            onValueChange={setMessage}
            minRows={6}
            maxRows={12}
            description={`${message.length}/2000 characters`}
            maxLength={2000}
          />

          <div>
            <label className="block text-sm font-medium mb-2">
              Attachment (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {attachment ? (
                  <p className="text-sm text-gray-700">
                    <strong>{attachment.name}</strong> (
                    {(attachment.size / 1024).toFixed(2)} KB)
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF, DOC (max. 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="bordered" type="button">
              Cancel
            </Button>
            <Button type="submit" color="primary" isLoading={isSubmitting}>
              Submit Request
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
