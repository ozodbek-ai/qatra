/**
 * @openapi
 * /courses:
 *   get:
 *     summary: Published kurslar ro'yxati
 *     tags:
 *       - Courses
 *     responses:
  200:
    description: Kurslar muvaffaqiyatli olindi.
    content:
      application/json:
        schema:
          type: array
          items:
            $ref: '#/components/schemas/Course'
 */

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
  200:
    description: Kurs topildi.
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Course'
 */