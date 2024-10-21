
// import Dummy from "../models/Dummy";

// class DummyService {
//   static create = async (data: {
//     banner_img: Buffer, avatar_img: Buffer
//   }) => {
//     try {
//       const result = await Dummy.create(data);
//       if (result instanceof Error) throw result;
//       else return result;
//     } catch (err) {
//       return new Error(err instanceof Error ? err.message : err);
//     }
//   };

//   static new = async () => {
//     try {
//       const result = await Dummy.create();
//       if (result instanceof Error) throw result;
//       else return result;
//     } catch (err) {
//       return new Error(err instanceof Error ? err.message : err);
//     }
//   };

//   static find = async (id: string) => {
//     const result = await Dummy.findByPk(id);
//     return result;
//   }
// }

// export default DummyService;