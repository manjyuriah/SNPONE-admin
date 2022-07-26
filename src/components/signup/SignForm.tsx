import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FormGroup,
  FormControlLabel,
  Button,
  Box,
  Checkbox,
  styled,
  Typography,
  FormControl,
  Input,
} from "@mui/material";
import { format } from "date-fns";
import FormInput from "../form/FormInput";
import FormRadio from "../form/FormRadio";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ResidenceSelectModal from "./ResidenceSelectModal";
import Terms from "./Terms";
import FormCheckboxBtn from "../form/FormCheckboxBtn";
import { useForm, SubmitHandler } from "react-hook-form";
import { ResidenceValue } from "../../store/form";
import { useRecoilValue } from "recoil";
import { FormValues } from "../../types/form";
import { RegexName, RegexBirth, RegexPhone, RegexEmail } from "./regex";

const SignForm = () => {
  const today = format(new Date(), "yyyy-MM-dd HH:mm:s");
  const userId = Math.random().toString(36).substring(2, 10);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({ mode: "onChange" });
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const address = data?.region + " " + data?.district;
    data.address = address;

    delete data.region;
    delete data.district;

    const postUser = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) {
          alert("지원이 완료되었습니다");
          // navigate("/");
          // return <Navigate to="/" />;
        }
      })
      .catch((error) => console.log(error));
  };
  const residence = useRecoilValue(ResidenceValue);

  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [termsType, setTermsType] = useState("개인정보");
  const [checked, setChecked] = React.useState([true, false]);

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked]);
  };

  const handleResidenceOpen = () => {
    setIsOpenSelect(true);
  };
  const handleResidenceClose = () => {
    setIsOpenSelect(false);
  };

  const handleTermsOpen = (event: string): void => {
    setIsTermsOpen(true);
    setTermsType(event);
  };
  const handleTermsClose = () => {
    setIsTermsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        {/* <FormControlLabel
        control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
        label="mode switch"
      /> */}
        <InputHidden {...register("date")} value={today} />
        <InputHidden {...register("id")} value={userId} />
        <CheckboxHidden {...register("isChecked")} />
        <FormInput
          label="이름"
          name="name"
          control={control}
          required={true}
          pattern={RegexName.regex}
          errorMessage={RegexName.message}
        />
        <FormControl sx={{ mt: 2, mb: 1 }}>
          <Typography variant="h6">성별</Typography>
          <FormRadio
            name="gender"
            control={control}
            values={["female", "male"]}
          />
        </FormControl>
        <FormInput
          label="생년월일"
          placeholder="YYYY.MM.DD"
          name="birth"
          control={control}
          inputProps={{
            maxLength: 12,
          }}
          required={true}
          pattern={RegexBirth.regex}
          errorMessage={RegexBirth.message}
        />
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            거주지역
          </Typography>
          <Button variant="outlined" onClick={handleResidenceOpen}>
            거주지역 선택
          </Button>
          <Typography
            sx={{
              mt: 1,
              fontSize: 14,
            }}
          >
            {residence}
          </Typography>
          {errors.address && <TypoError>시/도를 선택하세요.</TypoError>}
          {errors.address && <TypoError>시/구/군을 선택하세요.</TypoError>}
        </Box>
        <ResidenceSelectModal
          open={isOpenSelect}
          handleClose={handleResidenceClose}
          control={control}
        />
        <FormInput
          label="연락처"
          name="phone"
          control={control}
          inputProps={{
            maxLength: 11,
          }}
          required={true}
          pattern={RegexPhone.regex}
          errorMessage={RegexPhone.message}
        />
        <FormInput
          label="이메일"
          name="email"
          control={control}
          sx={{ mt: 2, mb: 3 }}
          required={true}
          pattern={RegexEmail.regex}
          errorMessage={RegexEmail.message}
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">주로 이용하는 교통 수단</Typography>
          <Typography sx={{ mb: 2, fontSize: 14 }}>
            주로 이용하는 교통 수단을 모두 선택해주세요
          </Typography>
          <FormCheckboxBtn
            name="transportation"
            control={control}
            register={register}
            values={[
              "버스",
              "지하철",
              "택시",
              "KTX/기차",
              "도보",
              "자전거",
              "전동킥보드",
              "자가용",
            ]}
            required={true}
          />
          {errors.transportation && (
            <TypoError>최소 1개 이상의 교통수단을 선택해주세요.</TypoError>
          )}
        </Box>
        <FormControlLabel
          label="이용약관 모두 동의"
          control={
            <Checkbox
              checked={checked[0] && checked[1]}
              indeterminate={checked[0] !== checked[1]}
              onChange={handleChange1}
              name="allchk"
              required
            />
          }
        />
        <Box sx={{ ml: 1, mb: 3 }}>
          <StyledTerms>
            <FormControlLabel
              label={
                <Typography sx={{ fontSize: 14 }}>
                  개인정보 처리방침 고지(필수)
                </Typography>
              }
              control={
                <Checkbox
                  checked={checked[0]}
                  onChange={handleChange2}
                  required
                />
              }
            />
            <Button onClick={() => handleTermsOpen("개인정보")}>
              <KeyboardArrowRightIcon />
            </Button>
          </StyledTerms>
          <StyledTerms>
            <FormControlLabel
              label={
                <Typography sx={{ fontSize: 14 }}>
                  제3자 정보제공 동의(필수)
                </Typography>
              }
              control={
                <Checkbox
                  checked={checked[1]}
                  onChange={handleChange3}
                  required
                />
              }
            />
            <Button onClick={() => handleTermsOpen("제3자")}>
              <KeyboardArrowRightIcon />
            </Button>
            <Terms
              open={isTermsOpen}
              type={termsType}
              handleClose={handleTermsClose}
            />
          </StyledTerms>
        </Box>
        <Button
          type="submit"
          disabled={!isDirty || !isValid}
          variant="contained"
          sx={{ height: 48, fontSize: 16 }}
        >
          지원하기
        </Button>
      </FormGroup>
    </form>
  );
};
export default SignForm;

const StyledTerms = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const InputHidden = styled(Input)({
  position: "absolute",
  top: "-9999px",
  visibility: "hidden",
});

const CheckboxHidden = styled(Checkbox)({
  position: "absolute",
  top: "-9999px",
  visibility: "hidden",
});

const TypoError = styled(Typography)({
  mt: 1,
  fontSize: 14,
  color: "#d32f2f",
});
