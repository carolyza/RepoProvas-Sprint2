import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Divider,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api, {
    Category,
    Discipline,
    Teacher,
    TeacherDisciplines,
    Test,
    TestByDiscipline,
  } from "../services/api";
import Form from "../components/Form";
import useAlert from "../hooks/useAlert";
import e from "express";

const styles = {
    container: {
      marginTop: "180px",
      width: "460px",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
    },
    title: { marginBottom: "30px" },
    dividerContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "16px",
      marginBottom: "26px",
    },
    input: { marginBottom: "16px" },
    actionsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  };

function Tests() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { setMessage } = useAlert();
  const [category, setCategory] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [instructor, setInstructor] = useState("");
  const [name, setName] = useState("");
  const [pdfUrl, setpdfUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [teachers, setTeachers] = useState([]);
  

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: categoriesData } = await api.getCategories(token);
      setCategories(categoriesData.categories);

      const { data: disciplinesData } = await api.getDisciplines(token);
      setDisciplines(disciplinesData.disciplines);

      
    }
    loadPage();
  }, [token]);

//   const [testData, setTestData] = useState
//         ({
//       name: "",
//       pdfUrl: "",
//        category: "",
//        discipline:"",
//        instructor:""
//     });

  
  const [formData, setFormData] = useState
   <FormData>
      ({
    name: "",
    pdfUrl: "",
     category: "",
     discipline:"",
     instructor:"",
     views: 0
  });


  {/* useEffect(() =>      async function loadPage() { */}
{/* //       if (!token) return;

//       const { data: testsData } = await api.getTestsByDiscipline(token);
//       setTerms(testsData.tests);
//       const { data: categoriesData } = await api.getCategories(token);
//       setCategories(categoriesData.categories);
//     }
//     loadPage();
//   }, [token]); */}

  interface FormData {
     name: string;
     pdfUrl: string;
     category: any;
discipline: any;
instructor: any;
views: 0;
   }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {

      if(e.target.name =="name"){
          setName(e.target.value );
      }
      else{
          setpdfUrl( e.target.value );
      }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
    setFormData({...formData, category: event.target.value});
  };

  const handleChangeDiscipline = (event: SelectChangeEvent) => {
    setDiscipline(event.target.value as string);
    getTeachers(parseInt(event.target.value)); 
    setFormData({...formData, discipline: event.target.value});
  };

  async function getTeachers(discipline:number){
    try{
      const { data: teachersData } = await api.getTeachers(discipline, token);
      setTeachers(teachersData.teachers);
      
    }
    catch(error){
console.log(error);
    }
  }


  const handleChangeInstructor = (event: SelectChangeEvent) => {
    setInstructor(event.target.value as string);
    setFormData({...formData, instructor: event.target.value});
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    console.log(formData)

   setFormData({ name: name, pdfUrl: pdfUrl, category: parseInt(category), discipline: parseInt(discipline), instructor: parseInt(instructor), views: 0 });

    if (
      !formData?.name ||
      !formData?.pdfUrl ||
      !formData?.category ||
      !formData?.discipline ||
      !formData?.instructor 
    ) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }


    try {
      await api.createTest(formData, token);
      setMessage({ type: "success", text: "Cadastro efetuado com sucesso!" });
      navigate("/login");
    } catch (error: Error | AxiosError | any) {
      if (error.response) {
        setMessage({
          type: "error",
          text: error.response.data,
        });
        return;
      }
      setMessage({
        type: "error",
        text: "Erro, tente novamente em alguns segundos!",
      });
    }
  }

  return (
    <>
    
      <TextField
        sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
        label="Pesquise por disciplina"
      />
      <Divider sx={{ marginBottom: "35px" }} />
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/adicionar-prova")}>
            Adicionar
          </Button>
        </Box>
        <Form onSubmit={handleSubmit}>
        <TextField
          name="name"
          sx={styles.input}
          label="Name"
          type="name"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.name}
        />
       <TextField
          name="pdfUrl"
          sx={styles.input}
          label="pdfUrl"
          type="pdfUrl"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.pdfUrl}
        />
        <InputLabel id="category">Categoria</InputLabel>
  <Select
    labelId="category"
    id="Category"
    value={category}
    label="Category"
    onChange={handleChangeCategory}
  >
    {categories.map((c)=>
    <MenuItem value={c.id}>{c.name}</MenuItem>
  )}
  </Select>
  <InputLabel id="discipline">Disciplina</InputLabel>
  <Select
    labelId="discipline"
    id="discipline"
    value={discipline}
    label="Discipline"
    onChange={handleChangeDiscipline}
  >
     {disciplines.map((d)=>
    <MenuItem value={d.id}>{d.name}</MenuItem>
  )}
  </Select>

  <InputLabel id="instructor">Professor</InputLabel>
  <Select
    labelId="instructor"
    id="Instructor"
    value={instructor}
    label="Instructor"
    onChange={handleChangeInstructor}
  >
     {teachers.map((t:any)=>
    <MenuItem value={t.teacher.id}>{t.teacher.name}</MenuItem>
  )} 
  </Select>
  <Button variant="contained" type="submit">
            Enviar
          </Button>
    </Form>
      </Box>
    </>
  );
  
        }
export default Tests;
