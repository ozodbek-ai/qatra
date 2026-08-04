export {};
/**
 * @openapi
 * components:
 *   schemas:
 *
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: cmsbxs0jd0000y7o9yxd3tmo7
 *         title:
 *           type: string
 *           example: Flutter Asoslari
 *         slug:
 *           type: string
 *           example: flutter-asoslari
 *         description:
 *           type: string
 *           example: Flutter yordamida mobil ilovalar yaratish
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         price:
 *           type: number
 *           example: 199000
 *         level:
 *           type: string
 *           enum:
 *             - BEGINNER
 *             - INTERMEDIATE
 *             - ADVANCED
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
 */ 
