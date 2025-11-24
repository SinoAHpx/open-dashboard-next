"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@heroui/react";
import { useState } from "react";

export default function SettingsConfigFormsPage() {
  return (
    <div className="w-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings & Configuration</h1>
        <p className="text-gray-600">
          Forms for managing workspace settings, application configuration, and
          billing information.
        </p>
      </div>

      <Tabs aria-label="Settings & Configuration forms">
        <Tab key="workspace" title="Workspace Settings">
          <WorkspaceSettingsForm />
        </Tab>
        <Tab key="billing" title="Billing & Subscription">
          <BillingSubscriptionForm />
        </Tab>
      </Tabs>
    </div>
  );
}

function WorkspaceSettingsForm() {
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [timezone, setTimezone] = useState("America/New_York");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    setTimeout(() => {
      console.log("Workspace settings updated:", {
        workspaceName,
        timezone,
        currency,
        language,
        dateFormat,
        timeFormat,
      });
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  const timezones = [
    { key: "America/New_York", label: "Eastern Time (ET)" },
    { key: "America/Chicago", label: "Central Time (CT)" },
    { key: "America/Denver", label: "Mountain Time (MT)" },
    { key: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { key: "Europe/London", label: "London (GMT)" },
    { key: "Europe/Paris", label: "Paris (CET)" },
    { key: "Asia/Tokyo", label: "Tokyo (JST)" },
    { key: "Asia/Shanghai", label: "Shanghai (CST)" },
    { key: "Australia/Sydney", label: "Sydney (AEDT)" },
  ];

  const currencies = [
    { key: "USD", label: "US Dollar (USD)" },
    { key: "EUR", label: "Euro (EUR)" },
    { key: "GBP", label: "British Pound (GBP)" },
    { key: "JPY", label: "Japanese Yen (JPY)" },
    { key: "CNY", label: "Chinese Yuan (CNY)" },
    { key: "AUD", label: "Australian Dollar (AUD)" },
    { key: "CAD", label: "Canadian Dollar (CAD)" },
  ];

  const languages = [
    { key: "en", label: "English" },
    { key: "es", label: "Spanish" },
    { key: "fr", label: "French" },
    { key: "de", label: "German" },
    { key: "ja", label: "Japanese" },
    { key: "zh", label: "Chinese" },
  ];

  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">General Settings</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            isRequired
            label="Workspace Name"
            placeholder="Enter workspace name"
            value={workspaceName}
            onValueChange={setWorkspaceName}
            description="This is the name that will be displayed to your team members"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              isRequired
              label="Timezone"
              placeholder="Select timezone"
              selectedKeys={timezone ? [timezone] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setTimezone(value);
              }}
            >
              {timezones.map((tz) => (
                <SelectItem key={tz.key}>{tz.label}</SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Currency"
              placeholder="Select currency"
              selectedKeys={currency ? [currency] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setCurrency(value);
              }}
            >
              {currencies.map((curr) => (
                <SelectItem key={curr.key}>{curr.label}</SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              label="Language"
              placeholder="Select language"
              selectedKeys={language ? [language] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setLanguage(value);
              }}
            >
              {languages.map((lang) => (
                <SelectItem key={lang.key}>{lang.label}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadioGroup
              label="Date Format"
              value={dateFormat}
              onValueChange={setDateFormat}
            >
              <Radio value="MM/DD/YYYY">MM/DD/YYYY (02/10/2025)</Radio>
              <Radio value="DD/MM/YYYY">DD/MM/YYYY (10/02/2025)</Radio>
              <Radio value="YYYY-MM-DD">YYYY-MM-DD (2025-02-10)</Radio>
            </RadioGroup>

            <RadioGroup
              label="Time Format"
              value={timeFormat}
              onValueChange={setTimeFormat}
            >
              <Radio value="12h">12-hour (2:30 PM)</Radio>
              <Radio value="24h">24-hour (14:30)</Radio>
            </RadioGroup>
          </div>

          {isSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              Workspace settings saved successfully!
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="bordered">Reset to Defaults</Button>
            <Button type="submit" color="primary" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

function BillingSubscriptionForm() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [billingCountry, setBillingCountry] = useState("US");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    setTimeout(() => {
      console.log("Billing information updated:", {
        plan: selectedPlan,
        cardLast4: cardNumber.slice(-4),
        billingAddress,
      });
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  const plans = [
    {
      key: "free",
      name: "Free",
      price: "$0",
      description: "For individuals just getting started",
    },
    {
      key: "pro",
      name: "Professional",
      price: "$29",
      description: "For professionals and small teams",
    },
    {
      key: "business",
      name: "Business",
      price: "$99",
      description: "For growing teams and businesses",
    },
    {
      key: "enterprise",
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with custom needs",
    },
  ];

  const countries = [
    { key: "US", label: "United States" },
    { key: "CA", label: "Canada" },
    { key: "GB", label: "United Kingdom" },
    { key: "AU", label: "Australia" },
    { key: "DE", label: "Germany" },
    { key: "FR", label: "France" },
    { key: "JP", label: "Japan" },
    { key: "CN", label: "China" },
  ];

  return (
    <Card className="max-w-3xl mt-4">
      <CardHeader>
        <h2 className="text-xl font-semibold">Billing & Subscription</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Select Plan</h3>
            <RadioGroup
              value={selectedPlan}
              onValueChange={setSelectedPlan}
              className="space-y-3"
            >
              {plans.map((plan) => (
                <Radio key={plan.key} value={plan.key}>
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-gray-600">
                        {plan.description}
                      </p>
                    </div>
                    <p className="font-semibold text-primary ml-4">
                      {plan.price}
                      {plan.price !== "Custom" && "/month"}
                    </p>
                  </div>
                </Radio>
              ))}
            </RadioGroup>
          </div>

          {selectedPlan !== "free" && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <Input
                    isRequired
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onValueChange={setCardNumber}
                    maxLength={19}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      isRequired
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onValueChange={setCardExpiry}
                      maxLength={5}
                    />
                    <Input
                      isRequired
                      label="CVC"
                      placeholder="123"
                      value={cardCvc}
                      onValueChange={setCardCvc}
                      maxLength={4}
                    />
                    <Input
                      isRequired
                      label="Cardholder Name"
                      placeholder="John Doe"
                      value={cardName}
                      onValueChange={setCardName}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                <div className="space-y-4">
                  <Input
                    isRequired
                    label="Street Address"
                    placeholder="123 Main St"
                    value={billingAddress}
                    onValueChange={setBillingAddress}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      isRequired
                      label="City"
                      placeholder="New York"
                      value={billingCity}
                      onValueChange={setBillingCity}
                    />
                    <Input
                      isRequired
                      label="ZIP / Postal Code"
                      placeholder="10001"
                      value={billingZip}
                      onValueChange={setBillingZip}
                    />
                    <Select
                      isRequired
                      label="Country"
                      placeholder="Select country"
                      selectedKeys={billingCountry ? [billingCountry] : []}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;
                        setBillingCountry(value);
                      }}
                    >
                      {countries.map((country) => (
                        <SelectItem key={country.key}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Your payment information is securely
                  processed through Stripe. We never store your complete card
                  details on our servers.
                </p>
              </div>
            </>
          )}

          {isSaved && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              Billing information saved successfully!
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button variant="bordered">Cancel</Button>
            <Button type="submit" color="primary" isLoading={isLoading}>
              {selectedPlan === "free"
                ? "Downgrade to Free"
                : "Update Subscription"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
