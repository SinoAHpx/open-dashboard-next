import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting database seed...");

	// Clean existing data
	console.log("Cleaning existing data...");
	await prisma.orderEvent.deleteMany();
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.userPointsLedger.deleteMany();
	await prisma.userMembership.deleteMany();
	await prisma.storeReview.deleteMany();
	await prisma.storeServiceItem.deleteMany();
	await prisma.serviceMedia.deleteMany();
	await prisma.serviceItem.deleteMany();
	await prisma.serviceCategory.deleteMany();
	await prisma.homepageCarouselSlide.deleteMany();
	await prisma.storePromotion.deleteMany();
	await prisma.storeImage.deleteMany();
	await prisma.store.deleteMany();
	await prisma.pet.deleteMany();
	await prisma.user.deleteMany();
	await prisma.membershipBenefit.deleteMany();
	await prisma.membershipLevel.deleteMany();
	console.log("✅ Cleaned existing data");

	// 1. Membership Levels
	console.log("Creating membership levels...");
	const membershipLevels = await Promise.all([
		prisma.membershipLevel.create({
			data: {
				code: "free",
				name: "Free Member",
				priceCents: 0,
				pointsMultiplier: "1.0",
				serviceDiscount: "0",
				productDiscount: "0",
				highlight: "Basic membership",
				description: "Free membership with basic benefits",
				benefits: {
					create: [
						{ displayOrder: 1, label: "Earn 1x points on purchases" },
						{ displayOrder: 2, label: "Access to standard services" },
					],
				},
			},
		}),
		prisma.membershipLevel.create({
			data: {
				code: "silver",
				name: "Silver Member",
				priceCents: 9900,
				pointsMultiplier: "1.5",
				serviceDiscount: "0.05",
				productDiscount: "0.05",
				highlight: "5% discount on all services",
				description: "Silver tier with enhanced benefits",
				benefits: {
					create: [
						{ displayOrder: 1, label: "Earn 1.5x points on purchases" },
						{ displayOrder: 2, label: "5% discount on services" },
						{ displayOrder: 3, label: "Priority booking" },
					],
				},
			},
		}),
		prisma.membershipLevel.create({
			data: {
				code: "gold",
				name: "Gold Member",
				priceCents: 19900,
				pointsMultiplier: "2.0",
				serviceDiscount: "0.10",
				productDiscount: "0.10",
				highlight: "10% discount + exclusive perks",
				description: "Premium gold tier membership",
				benefits: {
					create: [
						{ displayOrder: 1, label: "Earn 2x points on purchases" },
						{ displayOrder: 2, label: "10% discount on all services" },
						{ displayOrder: 3, label: "Priority booking & support" },
						{ displayOrder: 4, label: "Free monthly grooming" },
					],
				},
			},
		}),
	]);

	// 2. Users
	console.log("Creating users...");
	const users = await Promise.all(
		Array.from({ length: 5 }, (_, i) =>
			prisma.user.create({
				data: {
					openId: faker.string.alphanumeric(32),
					unionId: faker.string.alphanumeric(32),
					phone: faker.phone.number(),
					nickname: faker.person.fullName(),
					avatarUrl: faker.image.avatar(),
					pointsBalance: faker.number.int({ min: 0, max: 1000 }),
					currentMembershipLevelId: membershipLevels[i % 3].id,
					membershipExpireAt: faker.date.future(),
				},
			}),
		),
	);

	// 3. Pets
	console.log("Creating pets...");
	const petSpecies = ["dog", "cat", "other"];
	const petGenders = ["male", "female", "unknown"];
	const heightClasses = ["small", "large"];

	const pets = await Promise.all(
		users.flatMap((user) =>
			Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
				prisma.pet.create({
					data: {
						userId: user.id,
						name: faker.person.firstName(),
						species: faker.helpers.arrayElement(petSpecies) as any,
						breed: faker.animal.dog(),
						gender: faker.helpers.arrayElement(petGenders) as any,
					birthdate: faker.date.past({ years: 10 }),
					weightKg: faker.number.float({ min: 2, max: 50, fractionDigits: 1 }),
					color: faker.color.human(),
						shoulderHeightClass: faker.helpers.arrayElement(
							heightClasses,
						) as any,
						avatarUrl: faker.image.urlLoremFlickr({ category: "animals" }),
						neutered: faker.datatype.boolean(),
						vaccinated: faker.datatype.boolean(),
						notes: faker.lorem.sentence(),
					},
				}),
			),
		),
	);

	// 4. Stores
	console.log("Creating stores...");
	const stores = await Promise.all(
		Array.from({ length: 3 }, () =>
			prisma.store.create({
				data: {
					name: `${faker.company.name()} Pet Spa`,
					slug: faker.helpers.slugify(
						`${faker.company.name()}-pet-spa`,
					).toLowerCase(),
					description: faker.company.catchPhrase(),
					address: faker.location.streetAddress(),
					city: faker.location.city(),
					province: faker.location.state(),
					latitude: faker.location.latitude().toString(),
					longitude: faker.location.longitude().toString(),
					phone: faker.phone.number(),
					wechatId: faker.string.alphanumeric(16),
					businessHours: "Mon-Sun: 9:00 AM - 9:00 PM",
					heroImageUrl: faker.image.urlLoremFlickr({ category: "business" }),
					defaultDiscount: "10%",
					images: {
						create: Array.from({ length: 3 }, (_, i) => ({
							imageUrl: faker.image.urlLoremFlickr({ category: "business" }),
							displayOrder: i + 1,
						})),
					},
					promotions: {
						create: Array.from({ length: 2 }, () => ({
							title: faker.commerce.productAdjective() + " Special",
							description: faker.commerce.productDescription(),
							discountText: `${faker.number.int({ min: 10, max: 30 })}% OFF`,
							validFrom: faker.date.recent(),
							validTo: faker.date.future(),
							isActive: true,
						})),
					},
				},
			}),
		),
	);

	// 5. Service Categories and Items
	console.log("Creating service categories and items...");
	const serviceCategories = await Promise.all([
		prisma.serviceCategory.create({
			data: {
				name: "Grooming",
				slug: "grooming",
				description: "Professional pet grooming services",
				petScope: ["dog", "cat"],
				services: {
					create: [
						{
							title: "Basic Bath & Brush",
							subtitle: "Essential grooming care",
							description: "Complete bathing with shampoo, conditioner, and brush out",
							basePrice: "50.00",
							durationMinutes: 60,
							coverImageUrl: faker.image.urlLoremFlickr({ category: "animals" }),
							petScope: ["dog", "cat"],
							isActive: true,
						},
						{
							title: "Full Grooming Package",
							subtitle: "Complete makeover",
							description: "Bath, haircut, nail trim, ear cleaning",
							basePrice: "120.00",
							durationMinutes: 120,
							coverImageUrl: faker.image.urlLoremFlickr({ category: "animals" }),
							petScope: ["dog", "cat"],
							isActive: true,
						},
					],
				},
			},
		}),
		prisma.serviceCategory.create({
			data: {
				name: "Spa Treatment",
				slug: "spa",
				description: "Luxury spa treatments for your pet",
				petScope: ["dog", "cat", "spa"],
				services: {
					create: [
						{
							title: "Aromatherapy Massage",
							subtitle: "Relax and rejuvenate",
							description: "Soothing massage with essential oils",
							basePrice: "80.00",
							durationMinutes: 45,
							coverImageUrl: faker.image.urlLoremFlickr({ category: "animals" }),
							petScope: ["dog", "cat"],
							isActive: true,
						},
					],
				},
			},
		}),
		prisma.serviceCategory.create({
			data: {
				name: "Veterinary",
				slug: "veterinary",
				description: "Health and wellness services",
				petScope: ["dog", "cat", "other"],
				services: {
					create: [
						{
							title: "Health Check-up",
							subtitle: "Complete physical examination",
							description: "Comprehensive health assessment by certified vet",
							basePrice: "150.00",
							durationMinutes: 30,
							coverImageUrl: faker.image.urlLoremFlickr({ category: "animals" }),
							petScope: ["dog", "cat", "other"],
							isActive: true,
						},
					],
				},
			},
		}),
	]);

	// Get all service items
	const allServices = await prisma.serviceItem.findMany();

	// 6. Link services to stores
	console.log("Linking services to stores...");
	for (const store of stores) {
		await Promise.all(
			allServices.map((service) =>
				prisma.storeServiceItem.create({
					data: {
						storeId: store.id,
						serviceItemId: service.id,
						priceOverride: faker.datatype.boolean()
							? faker.commerce.price({ min: 40, max: 200, dec: 2 })
							: null,
						discountText: faker.datatype.boolean()
							? `${faker.number.int({ min: 5, max: 20 })}% OFF`
							: null,
						isAvailable: true,
					},
				}),
			),
		);
	}

	// 7. Store Reviews
	console.log("Creating store reviews...");
	await Promise.all(
		stores.flatMap((store) =>
			users.slice(0, 3).map((user) =>
				prisma.storeReview.create({
					data: {
						storeId: store.id,
						userId: user.id,
						rating: faker.number.int({ min: 3, max: 5 }),
						content: faker.lorem.paragraph(),
						visitedAt: faker.date.recent({ days: 30 }),
					},
				}),
			),
		),
	);

	// 8. Homepage Carousel
	console.log("Creating homepage carousel...");
	await Promise.all(
		Array.from({ length: 4 }, (_, i) =>
			prisma.homepageCarouselSlide.create({
				data: {
					title: faker.commerce.productName(),
					imageUrl: faker.image.urlLoremFlickr({
						width: 1200,
						height: 400,
						category: "animals",
					}),
					linkUrl: `/stores/${stores[i % stores.length].slug}`,
					displayOrder: i + 1,
					isActive: true,
				},
			}),
		),
	);

	// 9. Orders
	console.log("Creating orders...");
	const orderStatuses = ["pending", "confirmed", "processing", "completed", "cancelled"];

	await Promise.all(
		users.map((user) => {
			const userPets = pets.filter((pet) => pet.userId === user.id);
			return prisma.order.create({
				data: {
					orderNo: `ORD-${faker.string.alphanumeric(10).toUpperCase()}`,
					userId: user.id,
					storeId: stores[faker.number.int({ min: 0, max: stores.length - 1 })].id,
					membershipLevelId: user.currentMembershipLevelId,
					petId: userPets[0]?.id,
					status: faker.helpers.arrayElement(orderStatuses) as any,
					totalAmount: "150.00",
					discountAmount: "15.00",
					payableAmount: "135.00",
					appointmentAt: faker.date.future(),
					items: {
						create: allServices.slice(0, 2).map((service) => ({
							serviceItemId: service.id,
							petId: userPets[0]?.id,
							serviceType: "grooming",
							serviceName: service.title,
							unitPrice: service.basePrice,
							quantity: 1,
							notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
						})),
					},
					events: {
						create: [
							{
								fromStatus: null,
								toStatus: "pending",
								remark: "Order created",
							},
						],
					},
				},
			});
		}),
	);

	// 10. User Memberships
	console.log("Creating user memberships...");
	await Promise.all(
		users.map((user) =>
			prisma.userMembership.create({
				data: {
					userId: user.id,
					membershipLevelId: user.currentMembershipLevelId!,
					status: "active",
					startedAt: faker.date.past({ years: 1 }),
					expiresAt: user.membershipExpireAt,
					benefitsSnapshot: {
						discount: "10%",
						points: "2x",
					},
				},
			}),
		),
	);

	// 11. Points Ledger
	console.log("Creating points ledger...");
	await Promise.all(
		users.map((user) =>
			prisma.userPointsLedger.create({
				data: {
					userId: user.id,
					changeAmount: 100,
					balanceAfter: user.pointsBalance,
					reason: "Welcome bonus",
					referenceType: "signup",
				},
			}),
		),
	);

	console.log("✅ Database seeded successfully!");
}

main()
	.catch((e) => {
		console.error("❌ Error seeding database:");
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
