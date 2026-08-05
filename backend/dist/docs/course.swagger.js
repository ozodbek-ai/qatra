/**
 * @openapi
 * /courses:
 *   get:
 *     summary: Published kurslar ro'yxatini olish
 *     tags:
 *       - Courses
 *     responses:
 *       200:
 *         description: Kurslar muvaffaqiyatli olindi.
 */
export {};
/**
 * @openapi
 * /courses/{slug}:
 *   get:
 *     summary: Slug orqali kursni olish
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kurs topildi.
 *       404:
 *         description: Kurs topilmadi.
 */
/**
 * @openapi
 * /courses:
 *   post:
 *     summary: Yangi kurs yaratish
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourse'
 *     responses:
 *       201:
 *         description: Kurs yaratildi.
 *       409:
 *         description: Kurs allaqachon mavjud.
 */
/**
 * @openapi
 * /courses/{id}:
 *   put:
 *     summary: Kursni yangilash
 *     tags:
 *       - Courses
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
 *         description: Kurs yangilandi.
 *       404:
 *         description: Kurs topilmadi.
 */
/**
 * @openapi
 * /courses/{id}:
 *   delete:
 *     summary: Kursni o'chirish
 *     tags:
 *       - Courses
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
 *         description: Kurs o'chirildi.
 *       404:
 *         description: Kurs topilmadi.
 */
/**
 * @openapi
 * /courses/{id}/publish:
 *   patch:
 *     summary: Kursni publish yoki unpublish qilish
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Publish status o'zgartirildi.
 *       400:
 *         description: Kurs publish qilishga tayyor emas.
 *       404:
 *         description: Kurs topilmadi.
 */ 
