/**
 * @openapi
 * /lessons:
 *   post:
 *     summary: Yangi dars yaratish
 *     tags:
 *       - Lessons
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Dars muvaffaqiyatli yaratildi.
 */

/**
 * @openapi
 * /lessons/course/{courseId}:
 *   get:
 *     summary: Kursning barcha darslarini olish
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Darslar ro'yxati.
 */

/**
 * @openapi
 * /lessons/{id}:
 *   get:
 *     summary: Bitta darsni olish
 *     tags:
 *       - Lessons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dars topildi.
 *       404:
 *         description: Dars topilmadi.
 */

/**
 * @openapi
 * /lessons/{id}:
 *   put:
 *     summary: Darsni yangilash
 *     tags:
 *       - Lessons
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dars muvaffaqiyatli yangilandi.
 */

/**
 * @openapi
 * /lessons/{id}:
 *   delete:
 *     summary: Darsni o'chirish
 *     tags:
 *       - Lessons
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dars muvaffaqiyatli o'chirildi.
 */