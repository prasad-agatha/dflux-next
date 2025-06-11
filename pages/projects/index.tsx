// react
import React, { useEffect, FC } from "react";
// next router
import { useRouter } from "next/router";
// hooks
import { useRequest } from "@lib/hooks";
// react - bootstrap
import { Container, Button, Image } from "react-bootstrap";
// next seo
import { NextSeo } from "next-seo";
import { ArrowRight } from "@styled-icons/bootstrap/ArrowRight";
// components
import { CreateProject } from "components/modals";
import useDebounce from "lib/hooks/useDebounce";
import { Dropdown } from "react-bootstrap";
import { ArrowDropDown } from "@styled-icons/material/ArrowDropDown";
import { PlusCircle } from "@styled-icons/heroicons-outline/PlusCircle";

const HomePage: FC = () => {
  const router = useRouter();
  const [search, setSearch]: any = React.useState("");

  const { data: user }: any = useRequest({
    url: `api/users/me/`,
  });

  const debounceSearch = useDebounce(search, 500);

  // projects data
  const { data: projects, mutate: projectsMutate }: any = useRequest({
    url: `api/projects/?search=${debounceSearch}`,
  });

  const getProjectLetters = (name: any) => {
    const values = name.split(" ");
    const f_name = values[0];
    const l_name = values[1] ? name.substr(name.indexOf(" ") + 1) : "";
    const b = l_name ? `${f_name[0]}${l_name[0]}` : `${f_name[0]}`;
    return b.toUpperCase();
  };

  // create modal
  const [createProject, setCreateProject] = React.useState(false);

  function truncate(input: any) {
    if (input.length > 20) {
      return input.substring(0, 20) + "...";
    }
    return input;
  }

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
  };

  const gettingStarted = [
    {
      heading1: "Get started guide",
      heading2: "Your go-to-guide for how to start and create your first project",
      heading3: "Read the guide",
    },
    {
      heading1: "Sample Data",
      heading2: "Are you new to Dflux and you want to try it out. Check our sample data sets.",
      heading3: "Explore now",
    },
    {
      heading1: "Get Support",
      heading2: "Do you need more assistance? We’ll help you out.",
      heading3: "Contact Support",
    },
  ];

  const handleResource = (idx: any) => {
    return idx === "Get started guide"
      ? window.open("https://docs.intellect2.ai/intellect-insight")
      : idx === "Sample Data"
      ? router.push("/sampledatasets")
      : router.push("/supportrequest");
  };

  const [result, setResult] = React.useState([]);
  const [select, setSelect] = React.useState("Sort by name");

  useEffect(() => {
    if (projects) {
      let sort: any = [];
      const tempArr = [...projects];
      if (select === "Sort by name") {
        sort = tempArr.sort((a: any, b: any) => a.name.localeCompare(b.name));
      } else if (select === "Sort by date") {
        sort = tempArr.sort(
          (a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime()
        );
      }
      setResult(sort);
    }
  }, [projects, select]);
  return (
    <>
      <NextSeo title={`${process.env.CLIENT_NAME} - Projects`} description="Projects - Home" />
      <div className="px-4 mx-3">
        <Container fluid className="px-0">
          <div className="d-flex align-items-center py-3 mb-4">
            <div>
              <h3 className="fw-bold mb-2">Welcome {user?.first_name}!</h3>
              <p className="mb-2 f-16 opacity-75"> Connect and empower your business data.</p>
            </div>
            <div className="ms-auto mt-4">
              <Dropdown onSelect={(value: any) => setSelect(value)}>
                <Dropdown.Toggle className="w-100 bg-white border br-10" id="dropdown-basic">
                  <small className="sort text-dark-grey fw-normal">{select}</small>
                  <ArrowDropDown size="25" className="sort text-light-grey"></ArrowDropDown>
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item eventKey="Sort by name">Sort by name</Dropdown.Item>

                  <Dropdown.Item eventKey="Sort by date">Sort by date</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="ms-3">
              <input
                className="form-control search mt-4"
                type="text"
                placeholder="Search"
                aria-label="Search"
                onChange={handleSearch}
              />
            </div>
            <div className="ms-3 mt-4">
              <Button onClick={() => setCreateProject(!createProject)} className="text-white">
                <Image
                  src="/create1.svg"
                  alt="create new project"
                  width="24"
                  height="24"
                  className="me-2"
                />
                New project
              </Button>
            </div>
          </div>
          {/* Projects */}
          <div>
            {result.length > 0 ? (
              <>
                <h4 className="fw-bold mb-2">All projects</h4>
                <hr className="solid-line text-white" />
                <div className="row">
                  {result?.map((item: any, index: any) => {
                    return (
                      <>
                        <div
                          onClick={() => router.push(`/projects/${item.id}/`)}
                          key={index}
                          className="col-md-3"
                        >
                          <div className="card border-0 mb-3 d-flex align-items-center custom-card cursor-pointer">
                            <div className="p-3 pt-4">
                              <div className="project-letter-bg text-center mb-3">
                                <div className="row h-100 align-items-center">
                                  <span>{getProjectLetters(item.name)}</span>
                                </div>
                              </div>
                            </div>
                            <div
                              className="w-100  text-center border-top"
                              style={{ borderTop: " 1px solid #DBDDE0" }}
                            >
                              <div className="py-2 m-0 project-name fw-bold">
                                {truncate(item.name)}
                                <ArrowRight className="ms-2" width="20" height="20" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
                  <Image
                    src="/landingpage.svg"
                    alt="create notebook"
                    width="370"
                    height="270"
                    className="me-1"
                  />

                  <h6 className="fw-bold mt-2 ls black">
                    {process.env.CLIENT_NAME === "Dflux"
                      ? "Welcome to Dflux"
                      : "Welcome to Intellect INSIGHT"}
                  </h6>

                  <p className="ls black">
                    Bring your data into{" "}
                    {process.env.CLIENT_NAME === "Dflux" ? "Dflux" : "Intellect INSIGHT"} &amp;
                    create collaborative insights
                  </p>
                  <Button
                    className="ls f-14 text-center"
                    onClick={() => setCreateProject(!createProject)}
                    variant="outline-primary"
                  >
                    <div className="d-flex w-100 align-items-center">
                      <PlusCircle className="me-2" width={19} height={19} />
                      Create project
                    </div>
                  </Button>
                </div>
              </>
            )}
          </div>
          {/* Resources */}
          <div className="mt-4">
            <h4 className="fw-bold mb-2">Resources</h4>
            <hr className="solid-line text-white" style={{ width: 120 }} />

            <div className="row pt-3 g-4">
              {gettingStarted.filter((ele,id)=>process.env.CLIENT_NAME === "Dflux"?id===2:id+1).map(({ heading1, heading2, heading3 }, index) => {
                return (
                  <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 p-2">
                    <div className="card h-100 p-4">
                      <div className="card-text d-flex mb-3">
                        <div>
                          <h6 className="card-title fw-bold d-flex">
                            {process.env.CLIENT_NAME === "Dflux"
                              ? `${heading1}`
                              : `${heading1.replace("DFLUX", "INSIGHT")}`}
                          </h6>
                          <p className="card-text mt-3" style={{ color: "#707E8E" }}>
                            {process.env.CLIENT_NAME === "Dflux"
                              ? `${heading2}`
                              : `${heading2.replace("DFLUX", "Intellect INSIGHT")}`}
                          </p>
                        </div>
                      </div>
                      <p
                        className="f-12 cursor-pointer btn-lg fw-bold mt-auto mb-0"
                        onClick={() => handleResource(heading1)}
                      >
                        {heading3}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Create Project Modal */}
          <CreateProject
            createProject={createProject}
            setCreateProject={setCreateProject}
            projectsMutate={projectsMutate}
          />
        </Container>
      </div>
    </>
  );
};

export default HomePage;
