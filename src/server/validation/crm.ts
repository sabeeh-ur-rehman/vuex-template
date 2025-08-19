import { z } from 'zod';

export const CustomerSchema = z.object({
  customerName: z.string().min(2),
  contact: z.object({
    nameFirst: z.string().optional(),
    nameLast:  z.string().optional(),
    email1: z.string().email().optional(),
    email1Notify: z.boolean().optional(),
    email2: z.string().email().optional(),
    email2Notify: z.boolean().optional(),
    mobile1: z.string().optional(),
    mobile1Notify: z.boolean().optional(),
    mobile2: z.string().optional(),
    mobile2Notify: z.boolean().optional(),
    homePhone: z.string().optional(),
    workPhone: z.string().optional(),
    postal: z.string().optional(),
    postLocality: z.string().optional(),
    directions: z.string().optional(),
    acn: z.string().optional(),
    contractorLicNo: z.string().optional()
  }).optional(),
  siteAddress: z.string().optional(),
  sitePostcode: z.string().optional()
});

export const ProjectSchema = z.object({
  customerId: z.string().optional(),
  newCustomer: CustomerSchema.optional(),

  projectName: z.string().min(2),
  jobType: z.string().min(1),
  spaType: z.string().min(1),
  veType: z.string().min(1),
  siteType: z.string().optional(),

  repId: z.string().min(1),
  clientRequestDate: z.coerce.date(),

  siteAddress: z.string().min(3),
  sitePostcode: z.string().min(2),

  council: z.object({
    name: z.string().optional(),
    zone: z.string().optional(),
    adjustPct: z.number().optional(),
    isPropertySewered: z.boolean().optional(),
    insuranceClassification: z.string().optional(),
    lotNumber: z.string().optional(),
    depositedPlanNumber: z.string().optional(),
    siteArea: z.number().optional(),
  }).optional(),

  jobNotes: z.any().optional(),

  steps: z.array(z.object({
    stepNo: z.number().int(),
    description: z.string(),
    taskAssignDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    completedDate: z.coerce.date().optional(),
    appointmentAt: z.coerce.date().optional(),
    appointmentLocation: z.string().optional(),
    reminderHours1: z.number().optional(),
    reminderHours2: z.number().optional(),
    reminderHours3: z.number().optional(),
    remindersEmailTxt: z.string().optional()
  })).optional()
});
