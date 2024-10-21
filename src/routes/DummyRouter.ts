// import express, { Router, Request, Response } from 'express';
// import multer from 'multer';

// import DummyService from '../services/DummyService';

// const dummyRouter = Router();
// const uploadImages = multer({
//   storage: multer.memoryStorage()
// });

// dummyRouter.route("/upload_images").post(
//   uploadImages.fields([
//     { name: 'banner_img' }, { name: 'avatar_img' }
//   ]), async (req: Request, res: Response) => {
//     try {
//       let record = await DummyService.new();
//       if (record instanceof Error) throw record;
//       if (req.files) {
//         const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//         console.log("files: ", files);
//         if (files.banner_img && files.banner_img[0]) {
//           console.log('1');
//           record.banner_img = files.banner_img[0].buffer;
//         }
//         if (files.avatar_img && files.avatar_img[0]) {
//           console.log('2');
//           record.avatar_img = files.avatar_img[0].buffer;
//         }
//       }
//       await record.save();
//       console.log('record: ', record);
//       return res.status(201).json(record);
//     } catch (err) {
//       res.status(400).json({
//         error: err instanceof Error ? err.message : err
//       });
//     }
//   }
// )

// dummyRouter.route("/id/:id").get(
//   async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const result = await DummyService.find(id);
//     res.status(200).json(result);
//   }
// );

// export default dummyRouter;