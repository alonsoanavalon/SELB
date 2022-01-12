CREATE SCHEMA IF NOT EXISTS `selb` DEFAULT CHARACTER SET utf8 ;
USE `selb` ;

-- -----------------------------------------------------
-- Table `mydb`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `selb`.`usuario` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NULL,
  `clave` VARCHAR(100) NULL,
  PRIMARY KEY (`id`));