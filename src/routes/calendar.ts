import express from 'express';
import calendarController from '../controllers/calendarControllers';

const router = express.Router();

router.post('/todo', calendarController.addTodo);
router.post('/review', calendarController.addReview);
router.post('/addtag', calendarController.addTag);
router.post('/addcalendar', calendarController.addCalendar);
router.post(
  '/connectcalendarauthority',
  calendarController.connectCalendarAuthority
);

router.put('/updatetag', calendarController.updateTag);
router.put('/updatecalender', calendarController.updateCalendar);
router.put('/updatetodo', calendarController.updateTodo);
router.put('/updatereview', calendarController.updateReview);

router.delete('/deletetodo', calendarController.deleteTodo);
router.delete('/deletetag', calendarController.deleteTag);
router.delete('/deletecalendar', calendarController.deleteCalendar);
router.delete('/deletereview', calendarController.deleteReview);
router.delete(
  '/deletecalendarauthority',
  calendarController.deleteCalendarAuthority
);

router.get('/day', calendarController.day);
router.get('/tags', calendarController.getTag);
router.get('/todos', calendarController.getTodo);
router.get('/reviews', calendarController.getReview);
router.get('/calendars', calendarController.getCalendar);
router.get('/filterTags', calendarController.filterTags);
router.get('/calendarauthority', calendarController.getCalendarAuthority);
router.get(
  '/getcalendarauthorityofcalendar',
  calendarController.getCalendarAuthorityOfCalendar
);

export default router;
