export {};
/**
 * @openapi
 * components:
 *   schemas:
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Validation failed.
 *
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: cmsbxs0jd0000y7o9yxd3tmo7
 *
 *         title:
 *           type: string
 *           example: Flutter Asoslari
 *
 *         slug:
 *           type: string
 *           example: flutter-asoslari
 *
 *         description:
 *           type: string
 *           example: Flutter yordamida mobil ilovalar yaratish
 *
 *         imageUrl:
 *           type: string
 *           nullable: true
 *
 *         price:
 *           type: number
 *           example: 199000
 *
 *         category:
 *           type: string
 *           example: Mobile Development
 *
 *         duration:
 *           type: integer
 *           example: 1200
 *
 *         studentsCount:
 *           type: integer
 *           example: 523
 *
 *         averageRating:
 *           type: number
 *           format: float
 *           example: 4.9
 *
 *         level:
 *           type: string
 *           enum:
 *             - BEGINNER
 *             - INTERMEDIATE
 *             - ADVANCED
 *
 *         isPublished:
 *           type: boolean
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateCourse:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - description
 *         - price
 *         - level
 *       properties:
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         imageUrl:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         duration:
 *           type: integer
 *         level:
 *           type: string
 *           enum:
 *             - BEGINNER
 *             - INTERMEDIATE
 *             - ADVANCED
 *
 *     UpdateCourse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         imageUrl:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         duration:
 *           type: integer
 *         level:
 *           type: string
 *           enum:
 *             - BEGINNER
 *             - INTERMEDIATE
 *             - ADVANCED
 *
 *     PublishCourse:
 *       type: object
 *       required:
 *         - isPublished
 *       properties:
 *         isPublished:
 *           type: boolean
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum:
 *             - ADMIN
 *             - STUDENT
 *         isActive:
 *           type: boolean
 *
 *     Lesson:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         duration:
 *           type: integer
 *         order:
 *           type: integer
 *         videoUrl:
 *           type: string
 *           nullable: true
 *         isPreview:
 *           type: boolean
 *         isPublished:
 *           type: boolean
 */ 
