import { relations } from "drizzle-orm/relations";
import { users, doctors, hospitals, patients, labReports, labs, notifications, appointments, prescriptions, receptionists } from "./schema";

export const doctorsRelations = relations(doctors, ({one, many}) => ({
	user: one(users, {
		fields: [doctors.userId],
		references: [users.id]
	}),
	hospital: one(hospitals, {
		fields: [doctors.hospitalId],
		references: [hospitals.id]
	}),
	labReports: many(labReports),
	prescriptions: many(prescriptions),
	appointments: many(appointments),
}));

export const usersRelations = relations(users, ({many}) => ({
	doctors: many(doctors),
	hospitals: many(hospitals),
	labs: many(labs),
	notifications: many(notifications),
	patients: many(patients),
	appointments: many(appointments),
	receptionists: many(receptionists),
}));

export const hospitalsRelations = relations(hospitals, ({one, many}) => ({
	doctors: many(doctors),
	user: one(users, {
		fields: [hospitals.userId],
		references: [users.id]
	}),
	labs: many(labs),
	appointments: many(appointments),
	receptionists: many(receptionists),
}));

export const labReportsRelations = relations(labReports, ({one}) => ({
	patient: one(patients, {
		fields: [labReports.patientId],
		references: [patients.id]
	}),
	doctor: one(doctors, {
		fields: [labReports.doctorId],
		references: [doctors.id]
	}),
	lab: one(labs, {
		fields: [labReports.labId],
		references: [labs.id]
	}),
}));

export const patientsRelations = relations(patients, ({one, many}) => ({
	labReports: many(labReports),
	user: one(users, {
		fields: [patients.userId],
		references: [users.id]
	}),
	prescriptions: many(prescriptions),
	appointments: many(appointments),
}));

export const labsRelations = relations(labs, ({one, many}) => ({
	labReports: many(labReports),
	user: one(users, {
		fields: [labs.userId],
		references: [users.id]
	}),
	hospital: one(hospitals, {
		fields: [labs.hospitalId],
		references: [hospitals.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));

export const prescriptionsRelations = relations(prescriptions, ({one}) => ({
	appointment: one(appointments, {
		fields: [prescriptions.appointmentId],
		references: [appointments.id]
	}),
	patient: one(patients, {
		fields: [prescriptions.patientId],
		references: [patients.id]
	}),
	doctor: one(doctors, {
		fields: [prescriptions.doctorId],
		references: [doctors.id]
	}),
}));

export const appointmentsRelations = relations(appointments, ({one, many}) => ({
	prescriptions: many(prescriptions),
	patient: one(patients, {
		fields: [appointments.patientId],
		references: [patients.id]
	}),
	doctor: one(doctors, {
		fields: [appointments.doctorId],
		references: [doctors.id]
	}),
	hospital: one(hospitals, {
		fields: [appointments.hospitalId],
		references: [hospitals.id]
	}),
	receptionist: one(receptionists, {
		fields: [appointments.receptionistId],
		references: [receptionists.id]
	}),
	user: one(users, {
		fields: [appointments.createdBy],
		references: [users.id]
	}),
}));

export const receptionistsRelations = relations(receptionists, ({one, many}) => ({
	appointments: many(appointments),
	user: one(users, {
		fields: [receptionists.userId],
		references: [users.id]
	}),
	hospital: one(hospitals, {
		fields: [receptionists.hospitalId],
		references: [hospitals.id]
	}),
}));